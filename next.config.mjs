/** @type {import('next').NextConfig} */

const HOSTS = {
  READING: 'https://reading-room.84000.co',
  SCHOLAR: 'https://scholar.84000.co',
  SITE: 'https://brand.84000.co',
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
const TRANSLATION_REDIRECTS = [
  ['/translation/UT:id', '/translation-redirect/UT:id', true],
  ['/resource/core/WAE:id', '/translation-redirect/WAE:id', true],
  ['/translation/:id.html', '/translation/:id', true],
];

/** @type {[string, string, boolean?][]} */
const SOURCE_REDIRECTS = [
  ['/source/UT:id', '/source-redirect/UT:id', true],
  ['/source/UT:id/folio/:index', '/source-redirect/UT:id/folio/:index', true],
];

/** @type {[string, string, boolean?][]} */
const ASSET_REDIRECTS = [
  ['/data/:slug.pdf', '/pdf-redirect/:slug.pdf', true],
  ['/data/:slug.epub', '/epub-redirect/:slug.epub', true],
];

/** @type {[string, string, boolean?][]} */
const GLOSSARY_REDIRECTS = [
  ['/glossary/entity-:id.html', '/glossary/:id', true],
  ['/glossary/entity-:id', '/glossary/:id', true],
  ['/glossary/search.html', `${HOSTS.SCHOLAR}/glossary`, true],
  ['/glossary/:path*', `${HOSTS.SCHOLAR}/authority/:path*`, true],
  ['/glossary-search', `${HOSTS.SCHOLAR}/glossary`, true],
];

/** @type {[string, string, boolean?][]} */
const LEGACY_SECTION_REDIRECTS = [
  ['/untitled', HOSTS.READING, true],
  ['/section/O1JC11494.html', HOSTS.READING, true],
  ['/section/LOBBY.html', HOSTS.READING, true],
  ['/section/ALL-TRANSLATED.html', HOSTS.READING, true],
  ['/section/O1JC7630.html', HOSTS.READING, true],
  ['/section/all-translated.html', HOSTS.READING, true],
  ['/section/lobby.json', HOSTS.READING, true],
  ['/section/all-translated.json', HOSTS.READING, true],
  ['/section/lobby.html', HOSTS.READING, true],
];

/** @type {[string, string, boolean?][]} */
const LEGACY_CANON_REDIRECTS = [
  ['/section/O1JC114941JC20565.html', `${HOSTS.READING}/canon/tantra-collection`, true],
  ['/section/O1JC114941JC11495.html', `${HOSTS.READING}/canon/discipline`, true],
  ['/section/O1JC114941JC12924.html', `${HOSTS.READING}/canon/discourses`, true],
  ['/section/O1JC114941JC20568.html', `${HOSTS.READING}/canon/compendium-of-dharanis`, true],
  ['/section/O1JC114941JC20569.html', `${HOSTS.READING}/canon/aspiration`, true],
  ['/section/O1JC114941JC14667.html', `${HOSTS.READING}/canon/heap-of-jewels`, true],
  ['/section/O1JC114941JC20567.html', `${HOSTS.READING}/canon/wheel-of-time-commentary`, true],
  ['/section/O1JC114941JC14665.html', `${HOSTS.READING}/canon/perfection-of-wisdom`, true],
  ['/section/O1JC114941JC20566.html', `${HOSTS.READING}/canon/old-tantras`, true],
  ['/section/O1JC114941JC21412.html', `${HOSTS.READING}/canon/unexcelled-yoga-tantras`, true],
  ['/section/O1JC114941JC14718.html', `${HOSTS.READING}/canon/kangyur-catalog`, true],
  ['/section/O1JC114941JC14717.html', `${HOSTS.READING}/canon/dharani`, true],
  ['/section/O1JC114941JC14666.html', `${HOSTS.READING}/canon/ornaments-of-the-buddhas`, true],
  ['/section/O1JC114941JC14668.html', `${HOSTS.READING}/canon/general-sutra-section`, true],
  ['/section/O1JC114941JC14716.html', `${HOSTS.READING}/canon/tantra`, true],
  ['/section/O1JC114941JC14714.html', `${HOSTS.READING}/canon/thirteen-late-translated-sutras`, true],
  ['/section/O1JC76301JC11282.html', `${HOSTS.READING}/canon/sutra-commentary-and-philosophy`, true],
  ['/section/O1JC76301JC11092.html', `${HOSTS.READING}/canon/medicine`, true],
  ['/section/O1JC76301JC21609.html', `${HOSTS.READING}/canon/unexcelled-yoga-tantra-treatises`, true],
  ['/section/O1JC76301JC10893.html', `${HOSTS.READING}/canon/the-buddhas-previous-lives`, true],
  ['/section/O1JC76301JC11125.html', `${HOSTS.READING}/canon/politics-ethics`, true],
  ['/section/O1JC76301JC21610.html', `${HOSTS.READING}/canon/yoga-tantra-treatises`, true],
  ['/section/O1JC76301JC21612.html', `${HOSTS.READING}/canon/action-tantra-treatises`, true],
  ['/section/O1JC76301JC21613.html', `${HOSTS.READING}/canon/other-works-on-tantra`, true],
  ['/section/O1JC76301JC11279.html', `${HOSTS.READING}/canon/tengyur-catalog`, true],
  ['/section/O1JC76301JC11283.html', `${HOSTS.READING}/canon/traditional-sciences-and-arts`, true],
  ['/section/O1JC76301JC11050.html', `${HOSTS.READING}/canon/linguistics`, true],
  ['/section/O1JC76301JC11108.html', `${HOSTS.READING}/canon/technology-and-arts`, true],
  ['/section/O1JC76301JC11145.html', `${HOSTS.READING}/canon/miscellaneous-works`, true],
  ['/section/O1JC76301JC21611.html', `${HOSTS.READING}/canon/conduct-tantra-treatises`, true],
  ['/section/O1JC114941JC21416.html', `${HOSTS.READING}/canon/dedication-aspiration`, true],
  ['/section/O1JC76301JC10651.html', `${HOSTS.READING}/canon/sutra-commentary`, true],
  ['/section/O1JC76301JC10474.html', `${HOSTS.READING}/canon/middle-way`, true],
  ['/section/O1JC114941JC21414.html', `${HOSTS.READING}/canon/conduct-tantras`, true],
  ['/section/O1JC76301JC10908.html', `${HOSTS.READING}/canon/epistles`, true],
  ['/section/O1JC114941JC21415.html', `${HOSTS.READING}/canon/action-tantras`, true],
  ['/section/O1JC76301JC10956.html', `${HOSTS.READING}/canon/epistemology-and-logic`, true],
  ['/section/O1JC76301JC10823.html', `${HOSTS.READING}/canon/discipline-treatises`, true],
  ['/section/O1JC76301JC10788.html', `${HOSTS.READING}/canon/abhidharma`, true],
  ['/section/O1JC114941JC21413.html', `${HOSTS.READING}/canon/yoga-tantras`, true],
  ['/section/O1JC76301JC10416.html', `${HOSTS.READING}/canon/perfection-of-wisdom-treatises`, true],
  ['/section/O1JC76301JC10703.html', `${HOSTS.READING}/canon/mind-only`, true],
  ['/section/O1JC76301JC21630.html', `${HOSTS.READING}/canon/overviews-guides-rituals-and-prayers`, true],
  ['/section/O1JC76301JC8714.html', `${HOSTS.READING}/canon/other-skillful-means-tantras`, true],
  ['/section/O1JC76301JC21617.html', `${HOSTS.READING}/canon/general-unexcelled-yoga-tantra-works`, true],
  ['/section/O1JC76301JC21619.html', `${HOSTS.READING}/canon/samvara-related-tantras`, true],
  ['/section/O1JC76301JC21616.html', `${HOSTS.READING}/canon/skillful-means-tantra`, true],
  ['/section/O1JC76301JC8887.html', `${HOSTS.READING}/canon/general-unexcelled-yoga-tantra-works`, true],
  ['/section/O1JC76301JC7631.html', `${HOSTS.READING}/canon/eulogy`, true],
  ['/section/O1JC114941JC11497.html', `${HOSTS.READING}/canon/discipline`, true],
  ['/section/O1JC76301JC21625.html', `${HOSTS.READING}/canon/the-three-rosaries-of-abhayakaragupta`, true],
  ['/section/O1JC76301JC21620.html', `${HOSTS.READING}/canon/wisdom-tantra`, true],
  ['/section/O1JC76301JC21628.html', `${HOSTS.READING}/canon/the-hundred-sadhanas-translated-by-patshab`, true],
  ['/section/O1JC114941JC12882.html', `${HOSTS.READING}/canon/kangyur-catalog`, true],
  ['/section/O1JC76301JC21621.html', `${HOSTS.READING}/canon/guhyasamaja-related-tantras`, true],
  ['/section/O1JC76301JC8623.html', `${HOSTS.READING}/canon/other-skillful-means-tantras`, true],
  ['/section/O1JC114941JC11565.html', `${HOSTS.READING}/canon/ornaments-of-the-buddhas`, true],
  ['/section/O1JC114941JC12592.html', `${HOSTS.READING}/canon/old-tantras`, true],
  ['/section/O1JC76301JC21615.html', `${HOSTS.READING}/canon/wisdom-tantra`, true],
  ['/section/O1JC76301JC21614.html', `${HOSTS.READING}/canon/non-dual-tantra`, true],
  ['/section/O1JC76301JC21685.html', `${HOSTS.READING}/canon/treatises-early-tibetan-scholars`, true],
  ['/section/O1JC76301JC21686.html', `${HOSTS.READING}/canon/newly-inserted-miscellaneous-treatises-sutra-sciences`, true],
  ['/section/O1JC76301JC21627.html', `${HOSTS.READING}/canon/other-liturgical-works`, true],
  ['/section/O1JC76301JC21629.html', `${HOSTS.READING}/canon/the-hundred-sadhanas-translated-by-bari`, true],
  ['/section/O1JC76301JC21626.html', `${HOSTS.READING}/canon/ocean-of-sadhanas`, true],
  ['/section/O1JC76301JC21687.html', `${HOSTS.READING}/canon/dedication-aspiration-prayers`, true],
  ['/section/O1JC76301JC7704.html', `${HOSTS.READING}/canon/tantra-treatises`, true],
  ['/section/O1JC76301JC21622.html', `${HOSTS.READING}/canon/other-skillful-means-tantras`, true],
  ['/section/O1JC76301JC9561.html', `${HOSTS.READING}/canon/action-tantra-treatises`, true],
  ['/section/O1JC76301JC9356.html', `${HOSTS.READING}/canon/action-tantra-treatises`, true],
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
  ['/knowledgebase/ornaments-buddhas.html', `${HOSTS.SCHOLAR}/canon/articles`, true],
  ['/knowledgebase/stupa.html', `${HOSTS.SCHOLAR}/article/4c353d49-8e8e-4856-931c-83450af044fe`, true],
  ['/knowledgebase/heap-jewels.html', `${HOSTS.SCHOLAR}/article/64b31ee3-3243-413c-b731-51c26ee744df`, true],
  ['/knowledgebase/tarasripada.html', `${HOSTS.SCHOLAR}/canon/articles`, true],
  ['/knowledgebase/vasudavajra.html', `${HOSTS.SCHOLAR}/canon/articles`, true],
  ['/kb-articles/:path*', `${HOSTS.SCHOLAR}/articles/:path*`, true],
  ['/knowledge-base-articles', `${HOSTS.SCHOLAR}/canon/articles`, true],
  ['/tools-for-translators', HOSTS.SCHOLAR, true],
];

/** @type {[string, string, boolean?][]} */
const SITE_PATH_REDIRECTS = [
  ['/canon-sections/:path*', '/canon/:path*', true],
  ['/popular-themes/:path*', '/curated-collection/:path*', true],
  ['/popular-themes', '/curated-collection', true],
  ['/all-publications', '/reading-room', true],
  ['/all-publications-search', '/reading-room', true],
  ['/latest-publications', '/reading-room', true],
  ['/collection/:path*', '/reading-room', true],
  [
    '/introduction-to-kangyur-and-tengyur',
    '/post/a-brief-introduction-to-the-kangyur-and-tengyur',
    true,
  ],
];

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
  ...COMPLEX_REDIRECTS,
];

// ---------------------------------------------------------------
// Rewrites
// ---------------------------------------------------------------

/** @type {[string, string][]} */
const TRANSLATION_REWRITES = [
  [
    '/translation/:path*/index/:rest+',
    `${HOSTS.READING}/translation/:path*/index/:rest+`,
  ],
  [
    '/translation/:work/:part/:commentary',
    `${HOSTS.READING}/translation/:work/commentary-:commentary/:part.html`,
  ],
  ['/translation/:work/:part', `${HOSTS.READING}/translation/:work/:part.html`],
  [
    '/translation/:work.:format',
    `${HOSTS.READING}/translation/:work/:work.:format`,
  ],
  ['/translation/:work', `${HOSTS.READING}/translation/:work`],
  ['/translation/:path*', `${HOSTS.READING}/translation/:path*`],
];

/** @type {[string, string][]} */
const SOURCE_REWRITES = [
  [
    '/source/:work/folio/:index',
    `${HOSTS.READING}/source/:work/folio-:index.html`,
  ],
];

/** @type {[string, string][]} */
const GLOSSARY_REWRITES = [
  ['/glossary-embedded/:path*', `${HOSTS.SCHOLAR}/glossary-embedded/:path*`],
  ['/search-tm-embedded.html', `${HOSTS.SCHOLAR}/search-tm-embedded.html`],
  ['/glossary/:id', `${HOSTS.SCHOLAR}/glossary/named-entities/entity-:id.html`],
];

/** @type {[string, string][]} */
const STATIC_ASSET_REWRITES = [
  ['/_next/:file', `${HOSTS.READING}/_next/:file`],
  ['/catalogue/:path*', `${HOSTS.READING}/catalogue/:path*`],
  ['/frontend/:path*', `${HOSTS.READING}/frontend/:path*`],
  ['/images/:path*', `${HOSTS.READING}/images/:path*`],
  ['/audio/:path*', `${HOSTS.READING}/audio/:path*`],
];

/** @type {[string, string][]} */
const SITEMAP_REWRITES = [
  ['/website-sitemap.xml', `${HOSTS.SITE}/sitemap.xml`],
  ['/translation-sitemap.xml', `${HOSTS.READING}/translation/sitemap.xml`],
  ['/source-sitemap.xml', `${HOSTS.READING}/source/sitemap.xml`],
  [
    '/glossary-sitemap.xml',
    `${HOSTS.READING}/glossary/named-entities/sitemap.xml`,
  ],
];

/** @type {[string, string][]} */
const WELL_KNOWN_REWRITES = [
  ['/.well-known/:file.json', `${HOSTS.READING}/mobile-app/:file.json`],
  ['/.well-known/:file', `${HOSTS.READING}/mobile-app/:file.json`],
];

/** @type {[string, string][]} */
const READING_ROOM_REWRITES = [
  ['/canon/:path*', `${HOSTS.READING}/canon/:path*`],
  ['/curated-collection', `${HOSTS.READING}/curated-collection`],
  ['/curated-collection/:path*', `${HOSTS.READING}/curated-collection/:path*`],
  ['/reading-room', HOSTS.READING],
];

/** @type {[string, string][]} */
const LEGACY_OLD_SITE_REWRITES = [
  ['/old/:path*', `${HOSTS.READING}/old-site/:path*/index.html`],
];

/** @type {[string, string][]} */
const CATCH_ALL_REWRITES = [
  [
    '/:path((?!translation/|old|glossary/|source/|public|assets|images|api|sitemap-0.xml|reading-room|curated-collection|canon/).*)',
    `${HOSTS.READING}/:path*${SEED_QUERY}`,
  ],
];

const COMPLEX_REWRITES = [];

const rewritesConfig = [
  ...toRewrites(TRANSLATION_REWRITES),
  ...toRewrites(SOURCE_REWRITES),
  ...toRewrites(GLOSSARY_REWRITES),
  ...toRewrites(STATIC_ASSET_REWRITES),
  ...toRewrites(SITEMAP_REWRITES),
  ...toRewrites(WELL_KNOWN_REWRITES),
  ...toRewrites(READING_ROOM_REWRITES),
  ...toRewrites(LEGACY_OLD_SITE_REWRITES),
  ...toRewrites(CATCH_ALL_REWRITES),
  ...COMPLEX_REWRITES,
];

// ---------------------------------------------------------------

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return redirectsConfig;
  },
  async rewrites() {
    return rewritesConfig;
  },
};

export default nextConfig;
