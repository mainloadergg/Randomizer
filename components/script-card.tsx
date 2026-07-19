'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface ScriptCardProps {
  id: string
  title: string
  slug: string | null
  description: string | null
  language: string
  size: number
  createdAt: Date
  username: string | null
  onDelete: () => void
  onEdit: () => void
}

export function ScriptCard({
  id,
  title,
  slug,
  description,
  language,
  size,
  createdAt,
  username,
  onDelete,
  onEdit,
}: ScriptCardProps) {
  const [copied, setCopied] = useState(false)

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  }

  // Get raw URL
  const getRawUrl = () => {
    if (username && slug) {
      return `${window.location.origin}/${username}/raw/${slug}`
    }
    return `${window.location.origin}/raw/${id}`
  }

  const handleCopyRawUrl = async () => {
    const url = getRawUrl()
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyLoadstring = async () => {
    const url = getRawUrl()
    const loadstring = `loadstring(game:HttpGet("${url}"))()`
    await navigator.clipboard.writeText(loadstring)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg hover:text-white cursor-pointer truncate">
              <Link href={`/script/${id}`}>{title}</Link>
            </CardTitle>
            {description && <CardDescription className="line-clamp-2 text-xs sm:text-sm">{description}</CardDescription>}
          </div>
          <span className="text-xs px-2 py-1 bg-gray-800 rounded text-white whitespace-nowrap">
            {language}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 justify-between text-xs sm:text-sm text-gray-400">
            <span>{formatSize(size)}</span>
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>

          {slug && username && (
            <div className="mt-2 p-2 bg-gray-900 rounded border border-gray-800">
              <p className="text-xs text-gray-400 mb-1">Raw URL:</p>
              <p className="text-xs font-mono text-gray-300 break-all word-break">
                {getRawUrl()}
              </p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-3">
        <div className="flex gap-1 w-full flex-wrap">
          <Link href={`/script/${id}`} className="flex-1 min-w-[60px]">
            <Button variant="outline" size="sm" className="w-full text-xs">
              View
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={onEdit} className="flex-1 min-w-[60px] text-xs">
            Edit
          </Button>
        </div>
        <div className="flex gap-1 w-full flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyRawUrl}
            title="Copy raw URL"
            className="flex-1 min-w-[60px] text-xs"
          >
            {copied ? 'Copied!' : 'URL'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLoadstring}
            className="flex-1 min-w-[60px] text-xs"
            title="Copy loadstring"
          >
            Load
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete} className="flex-1 min-w-[60px] text-xs">
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
