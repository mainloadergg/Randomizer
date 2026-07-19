import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getScriptById } from '@/app/actions/scripts'
import { ScriptViewer } from '@/components/script-viewer'

export default async function ScriptPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session?.user) {
    redirect('/sign-in')
  }

  try {
    const script = await getScriptById(id)
    return (
      <main className="min-h-screen bg-black">
        <ScriptViewer script={script} user={session.user} />
      </main>
    )
  } catch (err) {
    redirect('/')
  }
}
