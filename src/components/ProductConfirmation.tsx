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

  const subtotal = product.price * quantity

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50">
      <div className="w-full bg-white rounded-t-3xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        {product.image && (
          <div className="flex justify-center bg-gray-50 rounded-xl p-4">
            <img src={product.image} alt={product.name} className="h-40 object-contain" />
          </div>
        )}

        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
          <p className="text-lg text-gray-600">SKU: {product.sku}</p>
        </div>

        {product.description && (
          <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
        )}

        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-sm text-gray-600 mb-1">Precio unitario</p>
          <p className="text-3xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
        </div>

        {product.colors && product.colors.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Seleccionar Color</label>
            <div className="flex gap-3 flex-wrap">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all border-2 ${
                    selectedColor === color
                      ? 'border-blue-600 bg-blue-100 text-blue-900'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">Cantidad</label>
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2 w-max">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-lg hover:bg-gray-100 active:bg-gray-200 font-bold text-lg border border-gray-300 transition-colors"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center text-lg font-bold bg-white border border-gray-300 rounded-lg py-1"
              min="1"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-lg hover:bg-gray-100 active:bg-gray-200 font-bold text-lg border border-gray-300 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Subtotal</p>
          <p className="text-3xl font-bold text-gray-900">${subtotal.toFixed(2)}</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 active:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 active:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Agregando...' : 'Agregar a Compra'}
          </button>
        </div>
      </div>
    </div>
  )
}
