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
  const buyItems = items.filter((i) => i.listType === 'buy')
  const totalBuy = buyItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-0 border-b-2 border-gray-200">
        <button
          onClick={() => onTabChange('buy')}
          className={`flex-1 py-3 font-semibold text-center transition-all border-b-4 -mb-[2px] ${
            tab === 'buy'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Comprar
          <span className="ml-2 inline-block bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {buyItems.length}
          </span>
        </button>
        <button
          onClick={() => onTabChange('wishlist')}
          className={`flex-1 py-3 font-semibold text-center transition-all border-b-4 -mb-[2px] ${
            tab === 'wishlist'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Deseados
          <span className="ml-2 inline-block bg-gray-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {items.filter((i) => i.listType === 'wishlist').length}
          </span>
        </button>
      </div>

      {tabItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">
            {tab === 'buy' ? 'Sin productos para comprar' : 'Sin productos deseados'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {tabItems.map((item, index) => {
            const actualIndex = items.indexOf(item)
            return (
              <div key={item.id} className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base">{item.name}</h3>
                    {item.color && <p className="text-sm text-gray-600 mt-1">Color: {item.color}</p>}
                    <p className="text-xs text-gray-500 mt-1">SKU: {item.sku}</p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(actualIndex)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg p-1 transition-colors"
                    title="Eliminar producto"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <p className="font-bold text-blue-600 text-lg">${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => onUpdateQuantity(actualIndex, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded hover:bg-gray-200 font-bold text-gray-700 border border-gray-300"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(actualIndex, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded hover:bg-gray-200 font-bold text-gray-700 border border-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-700">
                    Subtotal: <span className="text-blue-600">${(item.price * item.quantity).toFixed(2)}</span>
                  </p>
                  <button
                    onClick={() => onMoveItem(actualIndex, tab === 'buy' ? 'wishlist' : 'buy')}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                  >
                    {tab === 'buy' ? '♡ Deseados' : '➕ Comprar'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tabItems.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-300 sticky bottom-0">
          <p className="text-xs font-semibold text-gray-700 mb-1">SUBTOTAL</p>
          <p className="text-4xl font-bold text-blue-600">${subtotal.toFixed(2)}</p>
          {tab === 'buy' && buyItems.length > 0 && (
            <p className="text-xs text-gray-600 mt-2">{buyItems.length} artículo(s) para comprar</p>
          )}
        </div>
      )}
    </div>
  )
}
