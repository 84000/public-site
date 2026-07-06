import { NextResponse } from 'next/server'
// TO DO: import these from static repo
import workIds from './public/work-ids.json'
import { isProxiedPath, PROXY_USER_AGENT } from './lib/proxy-request'

function withProxyUserAgent(request) {
  const headers = new Headers(request.headers)
  headers.set('user-agent', PROXY_USER_AGENT)
  return NextResponse.next({ request: { headers } })
}

function handleAssetRedirect(request) {
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

export function middleware(request) {
  const { pathname } = request.nextUrl

  if (/^\/(translation|source|pdf|epub)-redirect\//i.test(pathname)) {
    return handleAssetRedirect(request)
  }

  if (isProxiedPath(pathname)) {
    return withProxyUserAgent(request)
  }
}

export const config = {
  matcher: [
    '/translation-redirect/:path*',
    '/source-redirect/:path*',
    '/pdf-redirect/:path*',
    '/epub-redirect/:path*',
    '/_next/:path*',
    '/catalogue/:path*',
    '/frontend/:path*',
    '/images/:path*',
    '/audio/:path*',
    '/translation',
    '/translation/:path*',
    '/canon',
    '/canon/:path*',
    '/curated-collection',
    '/curated-collection/:path*',
    '/reading-room',
    '/reading-room/:path*',
    '/entity/:type/:slug',
    '/.well-known/:path*',
    '/:path((?!translation/|canon$|canon/|curated-collection|reading-room|glossary/|public|assets|images|api|sitemap-0.xml|sitemap.xml|sitemap/|_next/|\\.well-known/|translation-redirect/|source-redirect/|pdf-redirect/|epub-redirect/|source/).*)',
  ],
}