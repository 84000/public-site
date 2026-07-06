export const PROXY_USER_AGENT = '84000-vercel-proxy';

/** Paths rewritten to reading-room.84000.co (see next.config.mjs). */
function isReadingRoomProxiedPath(pathname) {
  return (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/catalogue/') ||
    pathname.startsWith('/frontend/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/audio/') ||
    pathname === '/translation' ||
    pathname.startsWith('/translation/') ||
    pathname === '/canon' ||
    pathname.startsWith('/canon/') ||
    pathname === '/curated-collection' ||
    pathname.startsWith('/curated-collection/') ||
    pathname === '/reading-room' ||
    pathname.startsWith('/reading-room/') ||
    pathname.startsWith('/entity/') ||
    pathname.startsWith('/.well-known/')
  );
}

/**
 * Paths rewritten to brand.84000.co (catch-all in next.config.mjs).
 * Mirrors the negative-lookahead exclusions in SITE_REWRITES.
 */
function isBrandProxiedPath(pathname) {
  const path = pathname.replace(/^\//, '');
  if (!path) {
    return false;
  }

  if (path === 'canon' || path.startsWith('canon/')) {
    return false;
  }
  if (path === 'curated-collection' || path.startsWith('curated-collection/')) {
    return false;
  }
  if (path === 'reading-room' || path.startsWith('reading-room/')) {
    return false;
  }
  if (
    path.startsWith('translation/') ||
    path.startsWith('glossary/') ||
    path.startsWith('public') ||
    path.startsWith('assets') ||
    path.startsWith('images') ||
    path.startsWith('api') ||
    path.startsWith('sitemap') ||
    path.startsWith('_next/') ||
    path.startsWith('.well-known/') ||
    path.startsWith('translation-redirect/') ||
    path.startsWith('source-redirect/') ||
    path.startsWith('pdf-redirect/') ||
    path.startsWith('epub-redirect/') ||
    path.startsWith('source/')
  ) {
    return false;
  }

  return true;
}

/** True when next.config.mjs rewrites the request to an external origin. */
export function isProxiedPath(pathname) {
  return isReadingRoomProxiedPath(pathname) || isBrandProxiedPath(pathname);
}
