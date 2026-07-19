'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface RawPageClientProps {
  username: string
  slug: string
}

export function RawPageClient({ username, slug }: RawPageClientProps) {
  const [copied, setCopied] = useState(false)
  
  const loadstring = `loadstring(game:HttpGet("https://scripts-loader.xyz/${username}/raw/${slug}"))()`
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(loadstring)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-white">File Unavailable</h1>
          <p className="text-gray-400 text-sm">
            This file has unfortunately been taken down. Please use the original loader, it might work.
          </p>
        </div>

        {/* Loadstring Box */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-3">
          <p className="text-xs text-gray-400">Loadstring:</p>
          <code className="block bg-black p-3 rounded border border-gray-800 text-white text-xs font-mono break-all overflow-auto max-h-24">
            {loadstring}
          </code>
        </div>

        {/* Copy Button */}
        <Button
          onClick={handleCopy}
          className="w-full bg-white text-black hover:bg-gray-200 font-semibold"
        >
          {copied ? '✓ Copied to Clipboard' : 'Copy Loadstring'}
        </Button>
      </div>
    </div>
  )
}
