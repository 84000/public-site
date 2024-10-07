import { NextResponse } from 'next/server'
import { notFound } from 'next/navigation'
// TO DO: import these from static repo
import workIds from './public/work-ids.json'

export function middleware(request) {

  const utId = /(UT[a-zA-Z0-9\-]+)/i.exec(request.nextUrl.pathname);
  const tohId = /(TOH[a-zA-Z0-9\-]+)/i.exec(request.nextUrl.pathname);
  
  const workId = workIds.workId.find(workId => {
    return utId && workId.source === utId[1].toUpperCase() || tohId && workId.destination === tohId[1].toLowerCase();
  });

  if (!workId) {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }
  
  return NextResponse.redirect(new URL('/translation/'+ workId.destination, request.url));

}

export const config = {
  matcher: '/translation-redirect/:path*',
}