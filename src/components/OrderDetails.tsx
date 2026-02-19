'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

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

interface OrderDetailsProps {
  order: Order
  token: string
  onStatusChange: (newStatus: string) => void
  onError: (error: string) => void
}

export default function OrderDetails({
  order,
  token,
  onStatusChange,
  onError,
}: OrderDetailsProps) {
  const [status, setStatus] = useState(order.status)
  const [updating, setUpdating] = useState(false)

  const buyItems = order.items.filter((item) => item.listType === 'buy')
  const wishlistItems = order.items.filter((item) => item.listType === 'wishlist')

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true)
    try {
      await api.updateOrderStatus(order.id, newStatus, token)
      setStatus(newStatus)
      onStatusChange(newStatus)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating status'
      onError(message)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="w-full bg-white rounded-lg p-6 shadow-md space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{order.orderCode}</h2>
          <p className="text-sm text-gray-600">ID: {order.id}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-green-600">${order.subtotal.toFixed(2)}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="font-semibold text-gray-800 mb-3">Para Comprar ({buyItems.length})</h3>
        {buyItems.length === 0 ? (
          <p className="text-gray-500 text-sm">Sin productos</p>
        ) : (
          <div className="space-y-2">
            {buyItems.map((item) => (
              <div key={item.id} className="flex justify-between items-start p-2 bg-gray-50 rounded">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  {item.color && <p className="text-sm text-gray-600">{item.color}</p>}
                  <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">x{item.quantity}</p>
                  <p className="text-sm text-gray-600">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {wishlistItems.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-gray-800 mb-3">Deseados ({wishlistItems.length})</h3>
          <div className="space-y-2">
            {wishlistItems.map((item) => (
              <div key={item.id} className="flex justify-between items-start p-2 bg-gray-50 rounded opacity-75">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  {item.color && <p className="text-sm text-gray-600">{item.color}</p>}
                  <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">x{item.quantity}</p>
                  <p className="text-sm text-gray-600">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">Estado del Pedido</label>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={updating}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
        >
          <option value="pending">Pendiente</option>
          <option value="confirmed">Confirmado</option>
          <option value="paid">Pagado</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
        </select>
        {updating && <p className="text-sm text-gray-600 mt-2">Actualizando...</p>}
      </div>
    </div>
  )
}
