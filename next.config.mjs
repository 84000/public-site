/** @type {import('next').NextConfig} */

const HOSTS = {
  READING: 'https://reading-room.84000.co',
  SCHOLAR: 'https://scholar.84000.co',
  SITE: 'https://brand.84000.co',
  SOURCE: 'https://source.84000.co',
};

const SEED_QUERY = '?seed=true';

/** @param {[string, string, boolean?][]} tuples */
const toRedirects = (tuples) =>
  tuples.map(([source, destination, permanent = true]) => ({
    source,
    destination,
    permanent,
  }));

/** @param {[string, string][]} tuples */
const toRewrites = (tuples) =>
  tuples.map(([source, destination]) => ({ source, destination }));

// ---------------------------------------------------------------
// Redirects
// ---------------------------------------------------------------

/** @type {[string, string, boolean?][]} */
/** @type {[string, string, boolean?][]} */
const TRANSLATION_REDIRECTS = [
  ['/translation/UT:id', '/translation-redirect/UT:id', true],
  ['/resource/core/WAE:id', '/translation-redirect/WAE:id', true],
  // Strip .html, with an optional stray trailing dot (or dots) — e.g.
  // /translation/toh728.html. — likely a copy-paste/citation artifact in
  // whatever originally linked it. :trail is never used in the destination;
  // it exists purely to consume the trailing dot(s) so the match succeeds.
  // \.* (zero-or-more) means this one rule covers both toh728.html and
  // toh728.html. — no separate rule needed for the dot case.
  //
  // NOTE: uppercase Toh redirects were removed — path-to-regexp matches case-
  // insensitively at runtime in Next.js 14.2.4, so `Toh:id` ALSO matched
  // `/translation/toh*` and looped. Handle uppercase Toh at the CMS/source layer.
  ['/translation/:path(.*)\\.html:trail(\\.*)', '/translation/:path', true],
];

/** @type {[string, string, boolean?][]} */
const SOURCE_REDIRECTS = [
  // All /source/* paths redirect to source.84000.co
  ['/source/:path*', `${HOSTS.SOURCE}/:path*`, true],
];

/** @type {[string, string, boolean?][]} */
/** @type {[string, string, boolean?][]} */
const ASSET_REDIRECTS = [
  ['/data/:slug.pdf', '/pdf-redirect/:slug.pdf', true],
  ['/data/:slug.epub', '/epub-redirect/:slug.epub', true],
  // Legacy chapter-browser download links, e.g.
  // /browser/released/UT22084/046/UT22084-046-001.pdf
  // Always two directory levels (volume, chapter) in front of the filename —
  // :vol/:chap are captured only to be discarded; :slug is the full filename
  // minus extension and feeds the same /pdf-redirect/* pipeline as /data/*.pdf.
  ['/browser/released/:vol/:chap/:slug(.*)\\.pdf', '/pdf-redirect/:slug.pdf', true],
  // Alt legacy path with an extra "pdf" directory segment, e.g.
  // /data/pdf/UT22084-081-006.pdf — same UT filenames as /data/:slug.pdf above,
  // just nested one level deeper. :dir is captured only to be discarded.
  ['/data/:dir/:slug.pdf', '/pdf-redirect/:slug.pdf', true],
  // NOTE: /translation/{toh}.pdf is not redirected here. It is the canonical PDF
  // URL — the middleware (src/middleware.js) already redirects /pdf-redirect/*
  // back to /translation/{toh}.pdf, so adding a redirect from /translation/*.pdf
  // would create an infinite loop. If reading-room.84000.co doesn't serve PDFs
  // at this path, route the request via a rewrite (not a redirect).
];

/** @type {[string, string, boolean?][]} */
const GLOSSARY_REDIRECTS = [
  // Use named regex capture so :id doesn't swallow .html
  ['/glossary/entity-:id(\\d+)\\.html', `${HOSTS.SCHOLAR}/authority/:id`, true],
  ['/glossary/entity-:id', `${HOSTS.SCHOLAR}/authority/:id`, true],
  ['/glossary/search.html', `${HOSTS.SCHOLAR}/glossary`, true],
  // Legacy embedded glossary route
  ['/glossary-embedded/search.html', `${HOSTS.SCHOLAR}/glossary`, true],
  ['/glossary-embedded/:path*', `${HOSTS.SCHOLAR}/glossary`, true],
  // Bare numeric IDs (e.g. /glossary/2581) — must come before catch-all
  ['/glossary/:id(\\d+)', `${HOSTS.SCHOLAR}/authority/entity-:id`, true],
  ['/glossary/:path(.*)\\.html', '/glossary/:path', true],
  ['/glossary/:path*', `${HOSTS.SCHOLAR}/authority/:path*`, true],
  ['/glossary-search', `${HOSTS.SCHOLAR}/glossary`, true],
];

/** @type {[string, string, boolean?][]} */
const LEGACY_SECTION_REDIRECTS = [
  ['/untitled', '/reading-room', true],
  ['/section/O1JC11494.html', '/reading-room', true],
  ['/section/LOBBY.html', '/reading-room', true],
  ['/section/ALL-TRANSLATED.html', '/reading-room', true],
  ['/section/O1JC7630.html', '/reading-room', true],
  ['/section/all-translated.html', '/reading-room', true],
  ['/section/lobby.json', '/reading-room', true],
  ['/section/all-translated.json', '/reading-room', true],
  ['/section/lobby.html', '/reading-room', true],
];

/** @type {[string, string, boolean?][]} */
const LEGACY_CANON_REDIRECTS = [
  ['/section/O1JC114941JC20565.html', '/canon-sections/tantra-collection', true],
  ['/section/O1JC114941JC11495.html', '/canon-sections/discipline', true],
  ['/section/O1JC114941JC12924.html', '/canon-sections/discourses', true],
  ['/section/O1JC114941JC20568.html', '/canon-sections/compendium-of-dharanis', true],
  ['/section/O1JC114941JC20569.html', '/canon-sections/aspiration', true],
  ['/section/O1JC114941JC14667.html', '/canon-sections/heap-of-jewels', true],
  ['/section/O1JC114941JC20567.html', '/canon-sections/wheel-of-time-commentary', true],
  ['/section/O1JC114941JC14665.html', '/canon-sections/perfection-of-wisdom', true],
  ['/section/O1JC114941JC20566.html', '/canon-sections/old-tantras', true],
  ['/section/O1JC114941JC21412.html', '/canon-sections/unexcelled-yoga-tantras', true],
  ['/section/O1JC114941JC14718.html', '/canon-sections/kangyur-catalog', true],
  ['/section/O1JC114941JC14717.html', '/canon-sections/dharani', true],
  ['/section/O1JC114941JC14666.html', '/canon-sections/ornaments-of-the-buddhas', true],
  ['/section/O1JC114941JC14668.html', '/canon-sections/general-sutra-section', true],
  ['/section/O1JC114941JC14716.html', '/canon-sections/tantra', true],
  ['/section/O1JC114941JC14714.html', '/canon-sections/thirteen-late-translated-sutras', true],
  ['/section/O1JC76301JC11282.html', '/canon-sections/sutra-commentary-and-philosophy', true],
  ['/section/O1JC76301JC11092.html', '/canon-sections/medicine', true],
  ['/section/O1JC76301JC21609.html', '/canon-sections/unexcelled-yoga-tantra-treatises', true],
  ['/section/O1JC76301JC10893.html', '/canon-sections/the-buddhas-previous-lives', true],
  ['/section/O1JC76301JC11125.html', '/canon-sections/politics-ethics', true],
  ['/section/O1JC76301JC21610.html', '/canon-sections/yoga-tantra-treatises', true],
  ['/section/O1JC76301JC21612.html', '/canon-sections/action-tantra-treatises', true],
  ['/section/O1JC76301JC21613.html', '/canon-sections/other-works-on-tantra', true],
  ['/section/O1JC76301JC11279.html', '/canon-sections/tengyur-catalog', true],
  ['/section/O1JC76301JC11283.html', '/canon-sections/traditional-sciences-and-arts', true],
  ['/section/O1JC76301JC11050.html', '/canon-sections/linguistics', true],
  ['/section/O1JC76301JC11108.html', '/canon-sections/technology-and-arts', true],
  ['/section/O1JC76301JC11145.html', '/canon-sections/miscellaneous-works', true],
  ['/section/O1JC76301JC21611.html', '/canon-sections/conduct-tantra-treatises', true],
  ['/section/O1JC114941JC21416.html', '/canon-sections/dedication-aspiration', true],
  ['/section/O1JC76301JC10651.html', '/canon-sections/sutra-commentary', true],
  ['/section/O1JC76301JC10474.html', '/canon-sections/middle-way', true],
  ['/section/O1JC114941JC21414.html', '/canon-sections/conduct-tantras', true],
  ['/section/O1JC76301JC10908.html', '/canon-sections/epistles', true],
  ['/section/O1JC114941JC21415.html', '/canon-sections/action-tantras', true],
  ['/section/O1JC76301JC10956.html', '/canon-sections/epistemology-and-logic', true],
  ['/section/O1JC76301JC10823.html', '/canon-sections/discipline-treatises', true],
  ['/section/O1JC76301JC10788.html', '/canon-sections/abhidharma', true],
  ['/section/O1JC114941JC21413.html', '/canon-sections/yoga-tantras', true],
  ['/section/O1JC76301JC10416.html', '/canon-sections/perfection-of-wisdom-treatises', true],
  ['/section/O1JC76301JC10703.html', '/canon-sections/mind-only', true],
  ['/section/O1JC76301JC21630.html', '/canon-sections/overviews-guides-rituals-and-prayers', true],
  ['/section/O1JC76301JC8714.html', '/canon-sections/other-skillful-means-tantras', true],
  ['/section/O1JC76301JC21617.html', '/canon-sections/general-unexcelled-yoga-tantra-works', true],
  ['/section/O1JC76301JC21619.html', '/canon-sections/samvara-related-tantras', true],
  ['/section/O1JC76301JC21616.html', '/canon-sections/skillful-means-tantra', true],
  ['/section/O1JC76301JC8887.html', '/canon-sections/general-unexcelled-yoga-tantra-works', true],
  ['/section/O1JC76301JC7631.html', '/canon-sections/eulogy', true],
  ['/section/O1JC114941JC11497.html', '/canon-sections/discipline', true],
  ['/section/O1JC76301JC21625.html', '/canon-sections/the-three-rosaries-of-abhayakaragupta', true],
  ['/section/O1JC76301JC21620.html', '/canon-sections/wisdom-tantra', true],
  ['/section/O1JC76301JC21628.html', '/canon-sections/the-hundred-sadhanas-translated-by-patshab', true],
  ['/section/O1JC114941JC12882.html', '/canon-sections/kangyur-catalog', true],
  ['/section/O1JC76301JC21621.html', '/canon-sections/guhyasamaja-related-tantras', true],
  ['/section/O1JC76301JC8623.html', '/canon-sections/other-skillful-means-tantras', true],
  ['/section/O1JC114941JC11565.html', '/canon-sections/ornaments-of-the-buddhas', true],
  ['/section/O1JC114941JC12592.html', '/canon-sections/old-tantras', true],
  ['/section/O1JC76301JC21615.html', '/canon-sections/wisdom-tantra', true],
  ['/section/O1JC76301JC21614.html', '/canon-sections/non-dual-tantra', true],
  ['/section/O1JC76301JC21685.html', '/canon-sections/treatises-early-tibetan-scholars', true],
  ['/section/O1JC76301JC21686.html', '/canon-sections/newly-inserted-miscellaneous-treatises-sutra-sciences', true],
  ['/section/O1JC76301JC21627.html', '/canon-sections/other-liturgical-works', true],
  ['/section/O1JC76301JC21629.html', '/canon-sections/the-hundred-sadhanas-translated-by-bari', true],
  ['/section/O1JC76301JC21626.html', '/canon-sections/ocean-of-sadhanas', true],
  ['/section/O1JC76301JC21687.html', '/canon-sections/dedication-aspiration-prayers', true],
  ['/section/O1JC76301JC7704.html', '/canon-sections/tantra-treatises', true],
  ['/section/O1JC76301JC21622.html', '/canon-sections/other-skillful-means-tantras', true],
  ['/section/O1JC76301JC9561.html', '/canon-sections/action-tantra-treatises', true],
  ['/section/O1JC76301JC9356.html', '/canon-sections/action-tantra-treatises', true],
];

/** @type {[string, string, boolean?][]} */
const SCHOLAR_KNOWLEDGEBASE_REDIRECTS = [
  ['/knowledgebase/discourses.html', `${HOSTS.SCHOLAR}/article/01dc9a91-9be5-4dfe-8a09-9f453ac5bf48`, true],
  ['/knowledgebase/venuvana-kalandakanivapa.html', `${HOSTS.SCHOLAR}/article/808478ba-6ef5-4d5e-a1a7-632aa47ce7c1`, true],
  ['/knowledgebase/perfection-wisdom-kangyur.html', `${HOSTS.SCHOLAR}/article/16fd00dd-1e4e-440c-a497-1c98d2d848ed`, true],
  ['/knowledgebase/O1JC114941JC14718.html', `${HOSTS.SCHOLAR}/article/9b3f0c62-2ec4-4d52-94c7-fa0423da3227`, true],
  ['/knowledgebase/compendium-dharanis.html', `${HOSTS.SCHOLAR}/article/9742dc0e-651e-4df9-b9b4-3429b9c04d7e`, true],
  ['/knowledgebase/mahasutras.html', `${HOSTS.SCHOLAR}/article/ce74dbb9-26dd-464a-a9b6-180836a159ba`, true],
  ['/knowledgebase/EFT-KB-PURNA.html', `${HOSTS.SCHOLAR}/article/60d547d0-4400-4e8c-8e5e-7d6725d0de97`, true],
  ['/knowledgebase/EFT-KB-STUPA.html', `${HOSTS.SCHOLAR}/article/4c353d49-8e8e-4856-931c-83450af044fe`, true],
  ['/knowledgebase/thirteen-late-translated-sutras.html', `${HOSTS.SCHOLAR}/article/218c48c5-104e-446a-80ac-20e454bbdf1c`, true],
  ['/knowledgebase/ornaments-buddhas.html', `${HOSTS.SCHOLAR}/canon/article`, true],
  ['/knowledgebase/stupa.html', `${HOSTS.SCHOLAR}/article/4c353d49-8e8e-4856-931c-83450af044fe`, true],
  ['/knowledgebase/heap-jewels.html', `${HOSTS.SCHOLAR}/article/64b31ee3-3243-413c-b731-51c26ee744df`, true],
  ['/knowledgebase/tarasripada.html', `${HOSTS.SCHOLAR}/canon/article`, true],
  ['/knowledgebase/vasudavajra.html', `${HOSTS.SCHOLAR}/canon/article`, true],
  ['/knowledgebase/amoghanatha.html', `${HOSTS.SCHOLAR}/canon/article`, true],
  ['/knowledgebase/asokasri.html', `${HOSTS.SCHOLAR}/canon/article`, true],
  ['/kb-articles/:path*', `${HOSTS.SCHOLAR}/article/:path*`, true],
  ['/knowledge-base-articles', `${HOSTS.SCHOLAR}/canon/article`, true],
  ['/tools-for-translators', HOSTS.SCHOLAR, true],
];

/** @type {[string, string, boolean?][]} */
const SITE_PATH_REDIRECTS = [
  ['/canon-sections/:path*', '/canon/:path*', true],
  // Was: redirect to /translation/:tohid#UT:id (fragment URLs are invisible to Googlebot).
  // Now: redirect to the bare translation page so Googlebot can crawl it.
  ['/translation/:tohid/UT:id', '/translation/:tohid', true],
  ['/popular-themes/:path*', '/curated-collection/:path*', true],
  ['/popular-themes', '/curated-collection', true],
  ['/all-publications', '/reading-room', true],
  ['/all-publications-search', '/reading-room', true],
  ['/latest-publications', '/reading-room', true],
  ['/collection/:path*', '/reading-room', true],
  // WordPress-era category URLs (e.g. /category/announcements/publication/page/5)
  ['/category/:path*', '/reading-room', true],
  // Bare new-publication slugs (e.g. /new-publication-foo) → post listing
  ['/new-publication-:slug', '/post/:slug', true],
  [
    '/introduction-to-kangyur-and-tengyur',
    '/post/a-brief-introduction-to-the-kangyur-and-tengyur',
    true,
  ],
];

/** @type {[string, string, boolean?][]} */
const BROKEN_PROTOCOL_REDIRECTS = [
  // CMS bug: hrefs constructed as `${basePath}${fullUrl}` produce URLs like
  // /post/://84000.co/post/foo. Next.js normalizes duplicate slashes BEFORE
  // route matching (308 → /post/:/84000.co/...) so we match the normalized
  // single-slash form here. Long-term fix is in the CMS template that builds
  // these hrefs.
  ['/:prefix(.*)/:colon(\\:)/84000.co/:realpath*', '/:realpath*', true],
];

/** @type {[string, string, boolean?][]} */
const STRIP_TRAILING_REDIRECTS = [
  // /translation/{toh}/{ut-part}/toh{X} — strip the trailing toh segment.
  // Cause unknown (possibly a "related text" link incorrectly built as a path
  // segment). Constrained to trailing segments that start with "toh" so we
  // don't strip legitimate 3-segment translation URLs. Temporary 302.
  ['/translation/:toh/:ut/:trailing(toh[A-Za-z0-9\\-]+)', '/translation/:toh/:ut', false],
];

// NOTE: Two has-based redirects were tested and removed because Next.js 14.2.4
// does not substitute named capture groups from `has` conditions into the
// destination path (`:part` stayed unresolved, producing self-redirect loops):
//   1) /translation/:toh?part=X → /translation/:toh/X     (~73 GSC URLs)
//   2) Strip ".Copy" suffix from ?part= query             (~38 GSC URLs)
// Both need to be handled in middleware (src/middleware.js) instead, where the
// query param can be parsed and rewritten manually.
const COMPLEX_REDIRECTS = [];

const redirectsConfig = [
  ...toRedirects(TRANSLATION_REDIRECTS),
  ...toRedirects(SOURCE_REDIRECTS),
  ...toRedirects(ASSET_REDIRECTS),
  ...toRedirects(GLOSSARY_REDIRECTS),
  ...toRedirects(LEGACY_SECTION_REDIRECTS),
  ...toRedirects(LEGACY_CANON_REDIRECTS),
  ...toRedirects(SCHOLAR_KNOWLEDGEBASE_REDIRECTS),
  ...toRedirects(SITE_PATH_REDIRECTS),
  ...toRedirects(STRIP_TRAILING_REDIRECTS),
  ...toRedirects(BROKEN_PROTOCOL_REDIRECTS),
  ...COMPLEX_REDIRECTS,
];

// ---------------------------------------------------------------
// Rewrites (from Redirects rewrites.csv — reading-room only where listed)
// ---------------------------------------------------------------

/** @type {[string, string][]} */
const READING_ASSET_REWRITES = [
  ['/_next/static/:path*', `${HOSTS.READING}/_next/static/:path*`],
  ['/_next/image', `${HOSTS.READING}/_next/image`],
  ['/_next/:path*', `${HOSTS.READING}/_next/:path*`],
  ['/catalogue/:path*', `${HOSTS.READING}/catalogue/:path*`],
  ['/frontend/:path*', `${HOSTS.READING}/frontend/:path*`],
  ['/images/:path*', `${HOSTS.READING}/images/:path*`],
  ['/audio/:path*', `${HOSTS.READING}/audio/:path*`],
];

/** @type {[string, string][]} */
const READING_PAGE_REWRITES = [
  ['/translation', `${HOSTS.READING}`],
  ['/translation/:path*', `${HOSTS.READING}/translation/:path*`],
  ['/canon', `${HOSTS.READING}`],
  ['/canon/:path*', `${HOSTS.READING}/canon/:path*`],
  ['/curated-collection', `${HOSTS.READING}/curated-collection`],
  ['/curated-collection/:path*', `${HOSTS.READING}/curated-collection/:path*`],
  ['/reading-room', HOSTS.READING],
  ['/entity/:type/:slug', `${HOSTS.READING}/translation/entity/:type/:slug`],
];

/** @type {[string, string][]} */
const SITE_REWRITES = [
  ['/reading-room/:path*', `${HOSTS.READING}/:path*`],
  ['/sitemap.xml', '/sitemap/brand'],
  ['/website-sitemap.xml', '/sitemap/brand'],
  [
    '/:path((?!translation/|canon$|canon/|curated-collection|reading-room|glossary/|public|assets|images|api|sitemap-0.xml|sitemap.xml|sitemap/|_next/|\\.well-known/).*)',
    `${HOSTS.SITE}/:path*${SEED_QUERY}`,
  ],
];

const COMPLEX_REWRITES = [
  // All .well-known paths → reading-room.84000.co
  {
    source: '/.well-known/:path*',
    destination: 'https://reading-room.84000.co/.well-known/:path*',
  },
];

// Order: reading-room assets → reading-room pages → service config → brand (default).
// beforeFiles runs before the local /_next handler (required for proxied pages).
const rewritesConfig = {
  beforeFiles: [
    ...toRewrites(READING_ASSET_REWRITES),
    ...toRewrites(READING_PAGE_REWRITES),
    ...COMPLEX_REWRITES,
    ...toRewrites(SITE_REWRITES),
  ],
};

// ---------------------------------------------------------------

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  async redirects() {
    return redirectsConfig;
  },
  async rewrites() {
    return rewritesConfig;
  },
};

export default nextConfig;
