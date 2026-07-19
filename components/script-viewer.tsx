'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { updateScript, deleteScript } from '@/app/actions/scripts'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface Script {
  id: string
  userId: string
  title: string
  slug: string | null
  description: string | null
  code: string
  language: string
  size: number
  createdAt: Date
  updatedAt: Date
}

interface User {
  id: string
  email: string
  name: string | null
}

export function ScriptViewer({ script, user }: { script: Script; user: User }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(script.title)
  const [description, setDescription] = useState(script.description || '')
  const [code, setCode] = useState(script.code)
  const [language, setLanguage] = useState(script.language)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCopyRawUrl = async () => {
    const rawUrl = `${window.location.origin}/raw/${script.id}`
    await navigator.clipboard.writeText(rawUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      await updateScript(script.id, {
        title,
        description,
        code,
        language,
      })
      setIsEditing(false)
    } catch (err: any) {
      setError(err.message || 'Failed to save script')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this script?')) return

    try {
      await deleteScript(script.id)
      router.push('/')
      router.refresh()
    } catch (err: any) {
      console.error('[v0] Delete error:', err)
      setError(err.message || 'Failed to delete script')
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center gap-2">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-gray-300 text-xs sm:text-sm">
              ← Back
            </Button>
          </Link>
          <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
            <Button
              onClick={handleCopyRawUrl}
              variant="outline"
              className="border-gray-700 text-gray-200 hover:bg-gray-900 text-xs sm:text-sm py-1 sm:py-2"
            >
              {copied ? '✓ Copied' : 'Raw URL'}
            </Button>
            {!isEditing && (
              <>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-black hover:bg-gray-200 text-xs sm:text-sm py-1 sm:py-2"
                >
                  Edit
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm py-1 sm:py-2"
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-800 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {isEditing ? (
          <Card className="p-4 sm:p-8 bg-gray-900 border-gray-800">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Edit Script</h1>
            <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="title" className="text-gray-200 text-sm">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white text-sm"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-200 text-sm">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white text-sm"
                />
              </div>

              <div>
                <Label htmlFor="language" className="text-gray-200 text-sm">Language</Label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                >
                  <option value="lua">Lua</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="bash">Bash</option>
                </select>
              </div>

              <div>
                <Label htmlFor="code" className="text-gray-200 text-sm">Code</Label>
                <Textarea
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white font-mono text-xs sm:text-sm min-h-64 sm:min-h-96"
                  required
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-white text-black hover:bg-gray-200 text-sm"
                >
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="border-gray-700 text-gray-200 text-sm"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <>
            {/* Script Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 break-words">{script.title}</h1>
              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                <span>
                  Language: <span className="text-white font-medium">{script.language.toUpperCase()}</span>
                </span>
                <span>
                  Size: <span className="text-gray-300">{(script.size / 1024).toFixed(2)} KB</span>
                </span>
                <span className="hidden sm:inline">
                  Created: <span className="text-gray-300">{new Date(script.createdAt).toLocaleString()}</span>
                </span>
              </div>
              {script.description && (
                <p className="text-gray-300 mt-4 text-sm break-words">{script.description}</p>
              )}
            </div>

            {/* Code Display */}
            <Card className="bg-gray-900 border-gray-800 overflow-hidden">
              <div className="bg-gray-800 px-4 sm:px-6 py-2 sm:py-3 border-b border-gray-700 flex justify-between items-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-gray-300">{script.language}</span>
                <Button
                  onClick={async () => {
                    await navigator.clipboard.writeText(script.code)
                    alert('Code copied to clipboard!')
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-300 text-xs"
                >
                  Copy Code
                </Button>
              </div>
              <pre className="p-3 sm:p-6 text-gray-300 overflow-auto max-h-96 text-xs sm:text-sm">
                <code className="font-mono">{script.code}</code>
              </pre>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}
