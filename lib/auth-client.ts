'use client'

import { createAuthClient } from 'better-auth/react'

// Determine the base URL dynamically based on the environment
const getBaseURL = () => {
  // In browser, use relative path for API calls
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  // Fallback for SSR
  return process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000')
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
})

export const { signIn, signUp, signOut, useSession } = authClient
