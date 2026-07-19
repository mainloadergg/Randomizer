import { db } from '@/lib/db'
import { scripts, user } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string; slug: string }> }
) {
  const { username, slug } = await params

  try {
    // Get user by username
    const foundUser = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.username, username))

    if (!foundUser.length) {
      return new NextResponse('Page unavailable.', { status: 404 })
    }

    const userId = foundUser[0].id

    // Get script by slug and userId
    const script = await db
      .select({ code: scripts.code })
      .from(scripts)
      .where(and(eq(scripts.slug, slug), eq(scripts.userId, userId)))

    if (!script.length) {
      return new NextResponse('Page unavailable.', { status: 404 })
    }

    // Check if request is from browser or script executor
    const acceptHeader = request.headers.get('accept') || ''
    const userAgent = request.headers.get('user-agent') || ''
    
    // Consider it browser if: has text/html OR has typical browser user agent OR starts with capital letter (browser typical)
    const isBrowser = (
      acceptHeader.includes('text/html') ||
      (userAgent.includes('Mozilla') || userAgent.includes('Chrome') || userAgent.includes('Safari')) &&
      !userAgent.includes('curl') && 
      !userAgent.includes('wget') &&
      !userAgent.includes('Roblox')
    )

    if (isBrowser) {
      // Return HTML visual page for browser
      const loadstring = `loadstring(game:HttpGet("https://scripts-loader.xyz/${username}/raw/${slug}"))()`
      
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Script Loader - New Gen. Sys</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      background-color: #000;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 1rem;
    }
    .container {
      max-width: 448px;
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .message {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    p {
      font-size: 0.875rem;
      color: #9ca3af;
    }
    .loadstring-box {
      background-color: #111;
      border: 1px solid #333;
      border-radius: 0.5rem;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .label {
      font-size: 0.75rem;
      color: #9ca3af;
      text-align: left;
    }
    code {
      background-color: #000;
      padding: 0.75rem;
      border-radius: 0.375rem;
      border: 1px solid #333;
      color: #fff;
      font-size: 0.75rem;
      font-family: 'Courier New', monospace;
      word-break: break-all;
      overflow-wrap: break-word;
      max-height: 6rem;
      overflow-y: auto;
      text-align: left;
      display: block;
    }
    button {
      width: 100%;
      background-color: #fff;
      color: #000;
      border: none;
      padding: 0.75rem 1rem;
      border-radius: 0.375rem;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background-color 0.2s;
    }
    button:hover {
      background-color: #e5e5e5;
    }
    button:active {
      background-color: #d4d4d4;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="message">
      <h1>File Unavailable</h1>
      <p>This file has unfortunately been taken down. Please use the original loader, it might work.</p>
    </div>
    
    <div class="loadstring-box">
      <p class="label">Loadstring:</p>
      <code id="loadstring">${loadstring}</code>
    </div>
    
    <button id="copyBtn" onclick="copyLoadstring()">Copy Loadstring</button>
  </div>

  <script>
    function copyLoadstring() {
      const loadstring = document.getElementById('loadstring').textContent;
      navigator.clipboard.writeText(loadstring).then(() => {
        const btn = document.getElementById('copyBtn');
        const original = btn.textContent;
        btn.textContent = '✓ Copied to Clipboard';
        setTimeout(() => {
          btn.textContent = original;
        }, 2000);
      });
    }
  </script>
</body>
</html>
      `
      
      return new NextResponse(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      })
    } else {
      // Return plain text for script executor
      return new NextResponse(script[0].code, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      })
    }
  } catch (error) {
    return new NextResponse('Page unavailable.', { status: 403 })
  }
}
