"use client"

import { AlertCircle, X } from "lucide-react"

interface ErrorBannerProps {
  message: string
  onClose?: () => void
}

export function ErrorBanner({ message, onClose }: ErrorBannerProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-800">{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button onClick={onClose} className="inline-flex text-red-400 hover:text-red-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
