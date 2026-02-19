'use client'

import { useState } from 'react'

interface Product {
  id: string
  sku: string
  name: string
  price: number
  description?: string
  image?: string
  colors?: string[]
}

interface ProductConfirmationProps {
  product: Product
  onConfirm: (quantity: number, color?: string) => void
  onCancel: () => void
}

export default function ProductConfirmation({
  product,
  onConfirm,
  onCancel,
}: ProductConfirmationProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0])
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    onConfirm(quantity, selectedColor)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="w-full bg-white rounded-t-2xl p-6 animate-slide-up">
        {product.image && (
          <div className="mb-4 flex justify-center">
            <img src={product.image} alt={product.name} className="h-32 object-contain" />
          </div>
        )}

        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
        <p className="text-lg text-green-600 font-semibold mb-4">${product.price.toFixed(2)}</p>

        {product.description && (
          <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        )}

        {product.colors && product.colors.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    selectedColor === color
                      ? 'border-blue-600 bg-blue-50 font-semibold'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 font-bold text-lg"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 text-center text-xl font-bold border-2 border-gray-300 rounded-lg py-1"
              min="1"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 font-bold text-lg"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 disabled:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Agregando...' : 'Agregar a compra'}
          </button>
        </div>
      </div>
    </div>
  )
}
