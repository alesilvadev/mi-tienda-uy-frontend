'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

interface CashierOrderItem {
  id: string
  sku: string
  name: string
  quantity: number
  price: number
  listType: 'buy' | 'wishlist'
  color?: string
}

interface CashierOrder {
  id: string
  orderCode: string
  items: CashierOrderItem[]
  subtotal: number
  status: string
}

interface CashierOrderFormProps {
  onOrderFound: (order: CashierOrder) => void
  onError: (error: string) => void
  token: string
}

export default function CashierOrderForm({ onOrderFound, onError, token }: CashierOrderFormProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    setLoading(true)
    try {
      const order = await api.getOrderByCode(code, token)
      onOrderFound(order as CashierOrder)
      setCode('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Order not found'
      onError(message)
      setCode('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Ingresa código de pedido"
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-blue-500"
          disabled={loading}
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>
    </form>
  )
}
