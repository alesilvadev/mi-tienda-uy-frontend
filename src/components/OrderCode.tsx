'use client'

import { useState } from 'react'

interface OrderCodeProps {
  code: string
  orderId: string
}

export default function OrderCode({ code, orderId }: OrderCodeProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if ('share' in navigator) {
      await navigator.share({
        title: 'Tu Código de Pedido',
        text: `Mi código de pedido: ${code}`,
      })
    }
  }

  return (
    <div className="w-full bg-green-50 border-2 border-green-300 rounded-lg p-6 text-center">
      <p className="text-gray-700 text-sm mb-2">Tu código de pedido</p>
      <p className="text-4xl font-bold text-green-600 mb-6 font-mono tracking-widest">{code}</p>
      <p className="text-gray-600 text-sm mb-6">
        Presenta este código en caja para completar tu compra
      </p>

      <div className="flex gap-3 flex-col">
        <button
          onClick={handleCopy}
          className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          {copied ? '✓ Copiado' : 'Copiar código'}
        </button>
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleShare}
            className="w-full px-4 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
            Compartir
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        ID interno: <span className="font-mono">{orderId}</span>
      </p>
    </div>
  )
}
