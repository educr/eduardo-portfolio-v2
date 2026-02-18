import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function isSafeLocalAssetPath(pathname: string): boolean {
  return pathname.startsWith('/cases/') || pathname === '/me.jpeg' || pathname === '/Resume.pdf'
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== '/_next/image') {
    return NextResponse.next()
  }

  const encodedUrl = request.nextUrl.searchParams.get('url')
  if (!encodedUrl) {
    return NextResponse.next()
  }

  let decodedUrl: string
  try {
    decodedUrl = decodeURIComponent(encodedUrl)
  } catch {
    return NextResponse.next()
  }

  if (!decodedUrl.startsWith('/') || !isSafeLocalAssetPath(decodedUrl)) {
    return NextResponse.next()
  }

  const redirectUrl = new URL(decodedUrl, request.url)
  return NextResponse.redirect(redirectUrl, 307)
}

export const config = {
  matcher: ['/_next/image']
}
