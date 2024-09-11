import { NextResponse } from 'next/server'
import { notFound } from 'next/navigation'
// TO DO: import these from static repo
import workIds from './public/work-ids.json'

export function middleware(request) {

  const sourceId = /(UT[a-zA-Z0-9\-]+)/i.exec(request.nextUrl.pathname)
  const workId = workIds.workId.find(workId => {
    return workId.source === sourceId[1]
  })

  if (!workId) {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }

  return NextResponse.redirect(new URL('/translation/'+ workId.destination, request.url))

}

export const config = {
  matcher: '/translation-redirect/:path*',
}