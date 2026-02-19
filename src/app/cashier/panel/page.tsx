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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-700 font-semibold">Cargando panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-md border-2 border-gray-200">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-blue-600">Panel de Caja</h1>
            <p className="text-gray-600 text-lg">Mi Tienda UY</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors"
          >
            Salir
          </button>
        </div>

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

        {!order ? (
          <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-200 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Buscar Pedido</h2>
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
              className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors text-lg"
            >
              Buscar Otro Pedido
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
