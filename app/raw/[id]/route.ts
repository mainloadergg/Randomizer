import { db } from '@/lib/db'
import { scripts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Legacy route for raw script access by ID.
 * Public endpoint for loadstring compatibility.
 * New scripts should use /[username]/raw/[slug]
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    // Fetch the script by ID
    const script = await db
      .select()
      .from(scripts)
      .where(eq(scripts.id, id))
      .then(result => result[0] || null)

    // If script doesn't exist, return 404
    if (!script) {
      return new Response('Page unavailable.', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
        },
      })
    }

    // Return the raw code
    return new Response(script.code, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Length': script.code.length.toString(),
        'Cache-Control': 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('[Raw Route Error]', error)
    return new Response('Page unavailable.', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
}
