'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getScripts, deleteScript } from '@/app/actions/scripts'
import { getOrCreateUsername } from '@/app/actions/user'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScriptCard } from '@/components/script-card'
import { useEffect } from 'react'

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

export function Dashboard({ user }: { user: User }) {
  const router = useRouter()
  const [scripts, setScripts] = useState<Script[]>([])
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('lua')
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        // Load or create username
        const user = await getOrCreateUsername()
        setUsername(user)
        
        // Load scripts
        const data = await getScripts()
        setScripts(data)
      } catch (err) {
        console.error('[v0] Error loading data:', err)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleLogout = async () => {
    await authClient.signOut()
    router.push('/sign-in')
  }

  const handleCreateScript = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFormLoading(true)

    try {
      const { createScript } = await import('@/app/actions/scripts')
      await createScript(title, code, description, language)
      
      setTitle('')
      setDescription('')
      setCode('')
      setLanguage('lua')
      setShowForm(false)
      
      // Reload scripts
      const data = await getScripts()
      setScripts(data)
    } catch (err: any) {
      setError(err.message || 'Failed to create script')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteScript = async (id: string) => {
    if (!confirm('Are you sure you want to delete this script?')) return
    
    try {
      await deleteScript(id)
      setScripts(scripts.filter(s => s.id !== id))
    } catch (err) {
      setError('Failed to delete script')
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center gap-2 sm:gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">New Gen. Sys</h1>
            <p className="text-xs sm:text-sm text-gray-400 truncate">the best api of scripts at the moment.</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-xs sm:text-sm text-gray-400">Logged in as</p>
              <p className="text-xs sm:text-sm font-medium text-white truncate max-w-[150px]">{user.email}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gray-700 text-gray-200 hover:bg-gray-900 text-xs sm:text-sm"
            >
              Sign Out
            </Button>
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

        {/* Create Script Button */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="mb-6 sm:mb-8 bg-white text-black hover:bg-gray-200 font-semibold text-sm sm:text-base"
          >
            + New Script
          </Button>
        )}

        {/* Create Script Form */}
        {showForm && (
          <Card className="mb-8 p-6 bg-slate-900 border-slate-800">
            <h2 className="text-xl font-semibold text-white mb-4">Create New Script</h2>
            <form onSubmit={handleCreateScript} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-slate-200">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Script name"
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-slate-200">Description (optional)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this script do?"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="language" className="text-slate-200">Language</Label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                >
                  <option value="lua">Lua</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="bash">Bash</option>
                </select>
              </div>

              <div>
                <Label htmlFor="code" className="text-slate-200">Code</Label>
                <Textarea
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here (max 8MB)"
                  required
                  className="bg-slate-800 border-slate-700 text-white font-mono text-sm min-h-96"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {formLoading ? 'Creating...' : 'Create Script'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-slate-700 text-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Scripts Grid */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Your Scripts ({scripts.length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
              <p className="text-slate-400 mt-4">Loading scripts...</p>
            </div>
          ) : scripts.length === 0 ? (
            <Card className="p-8 text-center bg-slate-900 border-slate-800">
              <p className="text-slate-400">No scripts yet. Create your first one!</p>
            </Card>
          ) : (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {scripts.map((script) => (
                <ScriptCard
                  key={script.id}
                  id={script.id}
                  title={script.title}
                  slug={script.slug}
                  description={script.description}
                  language={script.language}
                  size={script.size}
                  createdAt={script.createdAt}
                  username={username}
                  onDelete={() => handleDeleteScript(script.id)}
                  onEdit={() => router.push(`/script/${script.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
