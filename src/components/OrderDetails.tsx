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
      const message = err instanceof Error ? err.message : 'Error actualizando estado'
      onError(message)
    } finally {
      setUpdating(false)
    }
  }

  const statusColors: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
    paid: 'bg-green-100 text-green-800 border-green-300',
    delivered: 'bg-purple-100 text-purple-800 border-purple-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
  }

  const statusLabels: { [key: string]: string } = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    paid: 'Pagado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  }

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-md space-y-5 border-2 border-gray-200">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-gray-900">{order.orderCode}</h2>
          <p className="text-sm text-gray-600">ID: {order.id}</p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-4xl font-bold text-blue-600">${order.subtotal.toFixed(2)}</p>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border-2 ${statusColors[status] || 'bg-gray-100'}`}>
            {statusLabels[status] || status}
          </span>
        </div>
      </div>

      <div className="border-t-2 border-gray-200 pt-5">
        <h3 className="font-bold text-gray-900 mb-4 text-lg">Para Comprar ({buyItems.length})</h3>
        {buyItems.length === 0 ? (
          <p className="text-gray-500 text-sm py-3">Sin productos para comprar</p>
        ) : (
          <div className="space-y-3">
            {buyItems.map((item) => (
              <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  {item.color && <p className="text-sm text-gray-600 mt-1">Color: {item.color}</p>}
                  <p className="text-xs text-gray-500 mt-1">SKU: {item.sku}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-gray-900 text-lg">x{item.quantity}</p>
                  <p className="text-sm font-semibold text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {wishlistItems.length > 0 && (
        <div className="border-t-2 border-gray-200 pt-5">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">Deseados ({wishlistItems.length})</h3>
          <div className="space-y-3">
            {wishlistItems.map((item) => (
              <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-70">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  {item.color && <p className="text-sm text-gray-600 mt-1">Color: {item.color}</p>}
                  <p className="text-xs text-gray-500 mt-1">SKU: {item.sku}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-gray-900 text-lg">x{item.quantity}</p>
                  <p className="text-sm font-semibold text-gray-600">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t-2 border-gray-200 pt-5">
        <label className="block text-sm font-bold text-gray-900 mb-3">Cambiar Estado del Pedido</label>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={updating}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed font-medium"
        >
          <option value="pending">Pendiente</option>
          <option value="confirmed">Confirmado</option>
          <option value="paid">Pagado</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
        </select>
        {updating && <p className="text-sm text-blue-600 mt-2 font-semibold">Actualizando estado...</p>}
      </div>
    </div>
  )
}
