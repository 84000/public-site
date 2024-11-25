import { NextResponse } from 'next/server'
import { notFound } from 'next/navigation'
// TO DO: import these from static repo
import workIds from './public/work-ids.json'

export function middleware(request) {

  const utId = /(UT[a-zA-Z0-9\-]+)/i.exec(request.nextUrl.pathname);
  const tohId = /(TOH[a-zA-Z0-9\-]+)/i.exec(request.nextUrl.pathname);
  
  // Get the workId from work-ids.json
  const workId = workIds.workId.find(workId => {
    return utId && workId.source === utId[1].toUpperCase() || tohId && workId.destination === tohId[1].toLowerCase();
  });

  // workId not found
  if ( !workId ) {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }

  // Source HTML page
  if ( /^\/source\-redirect\//i.test(request.nextUrl.pathname) ) {
    
    const paramFolio = /\/folio\/([0-9]+)/i.exec(request.nextUrl.pathname);
    const paramRefIndex = request.nextUrl.searchParams.get('ref-index');
    const paramPage = request.nextUrl.searchParams.get('page');
    var folio = 1;
    const isInteger = (string) => string == Number.parseInt(string);

    if ( Array.isArray(paramFolio) && isInteger(paramFolio[1]) ) {
      folio = Number.parseInt(paramFolio[1]);
    }
    else if ( isInteger(paramRefIndex) ) {
      folio = Number.parseInt(paramRefIndex);
    }
    else if( isInteger(paramPage) ) {
      folio = Number.parseInt(paramPage);
    }

    return NextResponse.redirect(new URL('/source/'+ workId.destination +'/folio/' + folio, request.url));

  }

  // Translation PDF
  if ( /^\/pdf\-redirect\//i.test(request.nextUrl.pathname) ) {
    return NextResponse.redirect(new URL('/translation/'+ workId.destination + '.pdf', request.url));
  }

  // Translation EPUB
  if ( /^\/epub\-redirect\//i.test(request.nextUrl.pathname) ) {
    return NextResponse.redirect(new URL('/translation/'+ workId.destination + '.epub', request.url));
  }

  // Translation HTML page
  return NextResponse.redirect(new URL('/translation/'+ workId.destination, request.url));

}

export const config = {
  matcher: ['/translation-redirect/:path*', '/source-redirect/:path*', '/pdf-redirect/:path*', '/epub-redirect/:path*'],
}