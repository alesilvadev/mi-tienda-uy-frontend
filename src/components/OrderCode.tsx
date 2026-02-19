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
    <div className="w-full bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 rounded-2xl p-8 text-center space-y-4">
      <p className="text-gray-700 text-sm font-semibold uppercase tracking-wide">Tu código de pedido</p>
      <div className="bg-white rounded-xl p-6 border-2 border-green-300">
        <p className="text-5xl font-bold text-green-600 font-mono tracking-widest">{code}</p>
      </div>
      <p className="text-gray-700 text-base font-medium">
        Presenta este código en caja para completar tu compra
      </p>

      <div className="flex gap-3 flex-col pt-2">
        <button
          onClick={handleCopy}
          className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          {copied ? '✓ Copiado' : 'Copiar código'}
        </button>
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleShare}
            className="w-full px-4 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 active:bg-gray-800 transition-colors"
          >
            Compartir
          </button>
        )}
      </div>

      <p className="text-xs text-gray-600 pt-2">
        ID interno: <span className="font-mono font-semibold">{orderId}</span>
      </p>
    </div>
  )
}
