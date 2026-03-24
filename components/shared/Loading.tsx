import React from 'react'

export default function Loading() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/55 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin">
            </div>
              <span className="text-sm text-muted-foreground">please wait...</span>
          </div>
        </div>
  )
}
