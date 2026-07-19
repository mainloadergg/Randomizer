'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { scripts, user } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'
import { generateSlug, getUniqueSlug } from '@/lib/slug'

const MAX_SCRIPT_SIZE = 8 * 1024 * 1024 // 8MB

/**
 * Resolve the current user id from the Better Auth session.
 * Every server action that touches user data MUST go through this helper
 * — it is the only thing standing between one user and another's rows.
 */
async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// Template — replace `items` and the field names with your own table.
//
// export async function getItems() {
//   const userId = await getUserId()
//   return db
//     .select()
//     .from(items)
//     .where(eq(items.userId, userId))
//     .orderBy(desc(items.createdAt))
// }
//
// export async function createItem(title: string) {
//   const userId = await getUserId()
//   const trimmed = title.trim()
//   if (!trimmed) return
//   await db.insert(items).values({ userId, title: trimmed })
//   revalidatePath("/")
// }
//
// export async function updateItem(id: number, fields: { completed?: boolean }) {
//   const userId = await getUserId()
//   await db
//     .update(items)
//     .set(fields)
//     .where(and(eq(items.id, id), eq(items.userId, userId)))
//   revalidatePath("/")
// }
//
// export async function deleteItem(id: number) {
//   const userId = await getUserId()
//   await db
//     .delete(items)
//     .where(and(eq(items.id, id), eq(items.userId, userId)))
//   revalidatePath("/")
// }

export async function getScripts() {
  const userId = await getUserId()
  return db
    .select()
    .from(scripts)
    .where(eq(scripts.userId, userId))
    .orderBy(desc(scripts.createdAt))
}

export async function getScriptById(id: string) {
  const userId = await getUserId()
  const result = await db
    .select()
    .from(scripts)
    .where(and(eq(scripts.id, id), eq(scripts.userId, userId)))
  
  if (!result.length) {
    throw new Error('Script not found')
  }
  
  return result[0]
}

export async function createScript(
  title: string,
  code: string,
  description?: string,
  language: string = 'lua'
) {
  const userId = await getUserId()
  
  const codeSize = new TextEncoder().encode(code).length
  
  if (codeSize > MAX_SCRIPT_SIZE) {
    throw new Error(`Script size exceeds maximum limit of 8MB (current: ${Math.round(codeSize / 1024 / 1024)}MB)`)
  }

  const trimmedTitle = title.trim()
  if (!trimmedTitle) {
    throw new Error('Title cannot be empty')
  }

  if (!code.trim()) {
    throw new Error('Code cannot be empty')
  }

  // Generate slug and ensure uniqueness
  const baseSlug = generateSlug(trimmedTitle)
  const existingScripts = await db
    .select({ slug: scripts.slug })
    .from(scripts)
    .where(eq(scripts.userId, userId))
  
  const existingSlugs = existingScripts
    .map((s) => s.slug)
    .filter((s): s is string => s !== null)
  
  const uniqueSlug = getUniqueSlug(baseSlug, existingSlugs)

  const scriptId = uuidv4()
  
  await db.insert(scripts).values({
    id: scriptId,
    userId,
    title: trimmedTitle,
    slug: uniqueSlug,
    description: description?.trim() || null,
    code,
    language,
    size: codeSize,
  })
  
  revalidatePath('/')
  return scriptId
}

export async function updateScript(
  id: string,
  fields: {
    title?: string
    description?: string
    code?: string
    language?: string
  }
) {
  const userId = await getUserId()
  
  // Verify ownership
  const existing = await db
    .select()
    .from(scripts)
    .where(and(eq(scripts.id, id), eq(scripts.userId, userId)))
  
  if (!existing.length) {
    throw new Error('Script not found')
  }

  // Validate code size if code is being updated
  if (fields.code) {
    const codeSize = new TextEncoder().encode(fields.code).length
    if (codeSize > MAX_SCRIPT_SIZE) {
      throw new Error(`Script size exceeds maximum limit of 8MB (current: ${Math.round(codeSize / 1024 / 1024)}MB)`)
    }
    fields = { ...fields, size: codeSize }
  }

  // Validate title if provided
  if (fields.title !== undefined) {
    if (!fields.title.trim()) {
      throw new Error('Title cannot be empty')
    }
    fields.title = fields.title.trim()
  }

  // Validate code if provided
  if (fields.code !== undefined && !fields.code.trim()) {
    throw new Error('Code cannot be empty')
  }

  const updateFields = {
    ...fields,
    updatedAt: new Date(),
  }

  await db
    .update(scripts)
    .set(updateFields)
    .where(and(eq(scripts.id, id), eq(scripts.userId, userId)))
  
  revalidatePath('/')
}

export async function deleteScript(id: string) {
  const userId = await getUserId()
  
  const result = await db
    .delete(scripts)
    .where(and(eq(scripts.id, id), eq(scripts.userId, userId)))
  
  revalidatePath('/')
  return result
}
