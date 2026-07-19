/**
 * Generate a URL-friendly slug from a title
 * @param title - The script title
 * @returns A lowercase, hyphenated slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by appending a number if needed
 * @param baseSlug - The base slug to check for uniqueness
 * @param existingSlugs - Array of existing slugs for this user
 * @returns A unique slug
 */
export function getUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug
  }

  let counter = 1
  while (existingSlugs.includes(`${baseSlug}${counter}`)) {
    counter++
  }

  return `${baseSlug}${counter}`
}
