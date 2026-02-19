'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CashierOrderForm from '@/components/CashierOrderForm'
import OrderDetails from '@/components/OrderDetails'
import { storage } from '@/lib/storage'

interface OrderItem {
  id: string
  sku: string
  name: string
  quantity: number
  price: number
  listType: 'buy' | 'wishlist'
  color?: string
}

interface Order {
  id: string
  orderCode: string
  items: OrderItem[]
  subtotal: number
  status: string
}

export default function CashierPanel() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const savedToken = storage.getCashierToken()
    if (!savedToken) {
      router.push('/cashier/login')
    } else {
      setToken(savedToken)
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    storage.clearCashierToken()
    router.push('/cashier/login')
  }

  const handleNewSearch = () => {
    setOrder(null)
    setError('')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Panel de Caja</h1>
            <p className="text-gray-600 text-sm">Mi Tienda UY</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Salir
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
            {error}
            <button
              onClick={() => setError('')}
              className="ml-2 font-semibold hover:underline"
            >
              Cerrar
            </button>
          </div>
        )}

        {!order ? (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Buscar Pedido</h2>
            <CashierOrderForm
              onOrderFound={setOrder}
              onError={setError}
              token={token || ''}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <OrderDetails
              order={order}
              token={token || ''}
              onStatusChange={() => {}}
              onError={setError}
            />
            <button
              onClick={handleNewSearch}
              className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Buscar Otro Pedido
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
