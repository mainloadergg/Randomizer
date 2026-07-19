'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

/**
 * Get or create username for current user
 */
export async function getOrCreateUsername() {
  const userId = await getUserId()

  const foundUser = await db
    .select({ username: user.username })
    .from(user)
    .where(eq(user.id, userId))

  if (!foundUser.length) {
    throw new Error('User not found')
  }

  // If username already exists, return it
  if (foundUser[0].username) {
    return foundUser[0].username
  }

  // Generate username from name
  const fullUser = await db
    .select({ email: user.email, name: user.name })
    .from(user)
    .where(eq(user.id, userId))

  if (!fullUser.length) {
    throw new Error('User not found')
  }

  // Create username from name (use name field from signup)
  let baseUsername = (fullUser[0].name || fullUser[0].email.split('@')[0])
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens

  // Ensure uniqueness by adding a number if needed
  let username = baseUsername
  let counter = 1

  while (true) {
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.username, username))

    if (!existingUser.length) {
      break
    }

    username = `${baseUsername}${counter}`
    counter++
  }

  // Update user with new username
  await db.update(user).set({ username }).where(eq(user.id, userId))

  return username
}

/**
 * Set a custom username for current user
 */
export async function setUsername(newUsername: string) {
  const userId = await getUserId()

  const trimmed = newUsername.trim().toLowerCase()

  if (trimmed.length < 3 || trimmed.length > 20) {
    throw new Error('Username must be between 3 and 20 characters')
  }

  if (!/^[a-z0-9_-]+$/.test(trimmed)) {
    throw new Error('Username can only contain letters, numbers, hyphens, and underscores')
  }

  // Check if username is already taken
  const existing = await db
    .select()
    .from(user)
    .where(eq(user.username, trimmed))

  if (existing.length && existing[0].id !== userId) {
    throw new Error('Username already taken')
  }

  await db.update(user).set({ username: trimmed }).where(eq(user.id, userId))

  return trimmed
}
