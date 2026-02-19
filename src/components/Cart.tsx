'use client'

import { useState } from 'react'

interface CartItem {
  id: string
  sku: string
  name: string
  quantity: number
  price: number
  color?: string
  listType: 'buy' | 'wishlist'
}

interface CartProps {
  items: CartItem[]
  onUpdateQuantity: (index: number, quantity: number) => void
  onRemoveItem: (index: number) => void
  onMoveItem: (index: number, newListType: 'buy' | 'wishlist') => void
  tab: 'buy' | 'wishlist'
  onTabChange: (tab: 'buy' | 'wishlist') => void
}

export default function Cart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onMoveItem,
  tab,
  onTabChange,
}: CartProps) {
  const tabItems = items.filter((item) => item.listType === tab)
  const subtotal = tabItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="w-full">
      <div className="flex gap-0 border-b border-gray-300 mb-4">
        <button
          onClick={() => onTabChange('buy')}
          className={`flex-1 py-3 font-semibold transition-colors ${
            tab === 'buy'
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Comprar ({items.filter((i) => i.listType === 'buy').length})
        </button>
        <button
          onClick={() => onTabChange('wishlist')}
          className={`flex-1 py-3 font-semibold transition-colors ${
            tab === 'wishlist'
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Deseados ({items.filter((i) => i.listType === 'wishlist').length})
        </button>
      </div>

      {tabItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">
            {tab === 'buy' ? 'Sin productos para comprar' : 'Sin productos deseados'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {tabItems.map((item, index) => {
            const actualIndex = items.indexOf(item)
            return (
              <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    {item.color && <p className="text-sm text-gray-600">{item.color}</p>}
                    <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(actualIndex)}
                    className="text-red-600 hover:text-red-800 font-bold text-lg"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-green-600">${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(actualIndex, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded hover:bg-gray-400 font-bold"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(actualIndex, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded hover:bg-gray-400 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-2">
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </p>

                <button
                  onClick={() => onMoveItem(actualIndex, tab === 'buy' ? 'wishlist' : 'buy')}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  {tab === 'buy' ? 'Mover a Deseados' : 'Mover a Comprar'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {tabItems.length > 0 && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Subtotal:</p>
          <p className="text-3xl font-bold text-gray-800">${subtotal.toFixed(2)}</p>
        </div>
      )}
    </div>
  )
}
