'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProductSearch from '@/components/ProductSearch'
import ProductConfirmation from '@/components/ProductConfirmation'
import Cart from '@/components/Cart'
import OrderCode from '@/components/OrderCode'
import { api } from '@/lib/api'
import { storage, type StoredOrder } from '@/lib/storage'

interface Product {
  id: string
  sku: string
  name: string
  price: number
  description?: string
  image?: string
  colors?: string[]
}

interface CartItem {
  id: string
  sku: string
  name: string
  quantity: number
  price: number
  color?: string
  listType: 'buy' | 'wishlist'
}

export default function Home() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'ready' | 'product-found' | 'order-complete' | 'error'>('loading')
  const [orderId, setOrderId] = useState<string>('')
  const [orderCode, setOrderCode] = useState<string>('')
  const [items, setItems] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string>('')
  const [cartTab, setCartTab] = useState<'buy' | 'wishlist'>('buy')
  const itemCounter = { current: 0 }

  useEffect(() => {
    const initOrder = async () => {
      try {
        const savedOrder = storage.getOrder()
        if (savedOrder) {
          setOrderId(savedOrder.orderId)
          setOrderCode(savedOrder.orderCode)
          setItems(savedOrder.items)
          itemCounter.current = Math.max(...savedOrder.items.map((_, i) => i + 1), 0)
          setStatus('ready')
        } else {
          const newOrder = await api.createOrder()
          setOrderId(newOrder.orderId || newOrder.id)
          setOrderCode(newOrder.orderCode)
          setStatus('ready')
          storage.setOrder({
            orderId: newOrder.orderId || newOrder.id,
            orderCode: newOrder.orderCode,
            items: [],
            subtotal: 0,
            status: 'pending',
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error initializing order')
        setStatus('error')
      }
    }

    initOrder()
  }, [])

  const handleProductFound = (product: Product) => {
    setSelectedProduct(product)
    setStatus('product-found')
    setError('')
  }

  const handleProductError = (errorMsg: string) => {
    setError(errorMsg)
  }

  const handleConfirmProduct = async (quantity: number, color?: string) => {
    if (!selectedProduct) return

    try {
      await api.addItem(orderId, selectedProduct.sku, quantity, color)

      const newItem: CartItem = {
        id: `item-${itemCounter.current++}`,
        sku: selectedProduct.sku,
        name: selectedProduct.name,
        quantity,
        price: selectedProduct.price,
        color,
        listType: 'buy',
      }

      const updatedItems = [...items, newItem]
      setItems(updatedItems)

      const subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      storage.setOrder({
        orderId,
        orderCode,
        items: updatedItems,
        subtotal,
        status: 'pending',
      })

      setSelectedProduct(null)
      setStatus('ready')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding item')
    }
  }

  const handleUpdateQuantity = async (index: number, newQuantity: number) => {
    try {
      await api.updateItem(orderId, index, newQuantity)
      const updatedItems = items.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      )
      setItems(updatedItems)
      const subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      storage.setOrder({
        orderId,
        orderCode,
        items: updatedItems,
        subtotal,
        status: 'pending',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating quantity')
    }
  }

  const handleRemoveItem = async (index: number) => {
    try {
      await api.removeItem(orderId, index)
      const updatedItems = items.filter((_, i) => i !== index)
      setItems(updatedItems)
      const subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      storage.setOrder({
        orderId,
        orderCode,
        items: updatedItems,
        subtotal,
        status: 'pending',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error removing item')
    }
  }

  const handleMoveItem = async (index: number, newListType: 'buy' | 'wishlist') => {
    try {
      await api.updateItem(orderId, index, undefined, newListType)
      const updatedItems = items.map((item, i) =>
        i === index ? { ...item, listType: newListType } : item
      )
      setItems(updatedItems)
      const subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      storage.setOrder({
        orderId,
        orderCode,
        items: updatedItems,
        subtotal,
        status: 'pending',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error moving item')
    }
  }

  const handleCloseOrder = async () => {
    try {
      await api.closeOrder(orderId)
      setStatus('order-complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error closing order')
    }
  }

  const handleNewOrder = () => {
    storage.clearOrder()
    setOrderId('')
    setOrderCode('')
    setItems([])
    setStatus('loading')
    window.location.reload()
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-700 font-semibold">Inicializando pedido...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-lg border-2 border-red-300">
          <p className="text-red-600 font-semibold mb-6 text-lg">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 font-semibold transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (status === 'order-complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="text-7xl mb-4">✓</div>
            <h1 className="text-4xl font-bold text-green-600">¡Pedido Cerrado!</h1>
            <p className="text-gray-600 text-lg">Tu pedido ha sido guardado exitosamente</p>
          </div>

          <OrderCode code={orderCode} orderId={orderId} />

          <button
            onClick={handleNewOrder}
            className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors text-lg"
          >
            Nuevo Pedido
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-4 z-10">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-blue-600">Mi Tienda UY</h1>
            <p className="text-gray-600 text-sm">Autogestión de Pedidos en Local</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg text-red-700 text-sm space-y-2">
            <p className="font-semibold">{error}</p>
            <button
              onClick={() => setError('')}
              className="text-xs font-semibold underline hover:no-underline"
            >
              Descartar
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-200">
          <ProductSearch onProductFound={handleProductFound} onError={handleProductError} />
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-200">
          <Cart
            items={items}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onMoveItem={handleMoveItem}
            tab={cartTab}
            onTabChange={setCartTab}
          />
        </div>

        {items.filter(i => i.listType === 'buy').length > 0 && (
          <button
            onClick={handleCloseOrder}
            className="w-full sticky bottom-4 px-4 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors text-lg shadow-lg"
          >
            Cerrar Pedido
          </button>
        )}

        {selectedProduct && status === 'product-found' && (
          <ProductConfirmation
            product={selectedProduct}
            onConfirm={handleConfirmProduct}
            onCancel={() => {
              setSelectedProduct(null)
              setStatus('ready')
            }}
          />
        )}
      </div>
    </div>
  )
}
