/** @type {import('next').NextConfig} */

const HOSTS = {
  STATIC: 'https://static.84000.co',
  SEARCH: 'https://read.84000-translate.org',
  SITE: 'https://site.84000.co',
};

const SEED_QUERY = '?seed=true';

// ---------------------------------------------------------------
// Redirects
// ---------------------------------------------------------------

// Simple redirects as [source, destination, permanent?]
/** @type {[string, string, boolean?][]} */
const SIMPLE_REDIRECTS = [
  // Resolve UT ids
  ['/translation/UT:id', '/translation-redirect/UT:id', true],
  ['/resource/core/WAE:id', '/translation-redirect/WAE:id', true],

  // Legacy translation .html
  ['/translation/:id.html', '/translation/:id', true],

  // Source UT ids
  ['/source/UT:id', '/source-redirect/UT:id', true],
  ['/source/UT:id/folio/:index', '/source-redirect/UT:id/folio/:index', true],

  // PDFs
  ['/data/:slug.pdf', '/pdf-redirect/:slug.pdf', true],

  // epubs
  ['/data/:slug.epub', '/epub-redirect/:slug.epub', true],

  // Glossary
  ['/glossary/entity-:id.html', '/glossary/:id', true],
  ['/glossary/entity-:id', '/glossary/:id', true],
  ['/glossary/search.html', '/glossary-search', true],
];

// Redirects that need extra fields (`has`, etc.) stay as objects
const COMPLEX_REDIRECTS = [
  {
    // Legacy links with .html extension and ref-index parameter
    source: '/source/:id.html',
    has: [
      {
        type: 'query',
        key: 'ref-index',
        value: '(?<index>\\d{1,})',
      },
    ],
    destination: '/source/:id/folio/:index',
    permanent: true,
  },
  {
    // Legacy links with .html extension and page parameter
    source: '/source/:id.html',
    has: [
      {
        type: 'query',
        key: 'page',
        value: '(?<index>\\d{1,})',
      },
    ],
    destination: '/source/:id/folio/:index',
    permanent: true,
  },
];

// Final redirects config
const redirectsConfig = [
  ...SIMPLE_REDIRECTS.map(([source, destination, permanent = true]) => ({
    source,
    destination,
    permanent,
  })),
  ...COMPLEX_REDIRECTS,
];

// ---------------------------------------------------------------
// Rewrites
// ---------------------------------------------------------------

// All rewrites that can be expressed as [source, destination]
/** @type {[string, string][]} */
const SIMPLE_REWRITES = [
  // /translation/:path*/index/:rest+ -> search host
  [
    '/translation/:path*/index/:rest+',
    `${HOSTS.SEARCH}/translation/:path*/index/:rest+`,
  ],

  // glossary-embedded
  ['/glossary-embedded/:path*', `${HOSTS.SEARCH}/glossary-embedded/:path*`],
  ['/search-tm-embedded.html', `${HOSTS.SEARCH}/search-tm-embedded.html`],

  // translation -> static host
  [
    '/translation/:work/:part/:commentary',
    `${HOSTS.STATIC}/translation/:work/commentary-:commentary/:part.html`,
  ],
  [
    '/translation/:work/:part',
    `${HOSTS.STATIC}/translation/:work/:part.html`,
  ],
  [
    '/translation/:work.:format',
    `${HOSTS.STATIC}/translation/:work/:work.:format`,
  ],
  [
    '/translation/:work',
    `${HOSTS.STATIC}/translation/:work/index.html`,
  ],

  // source -> static host
  [
    '/source/:work/folio/:index',
    `${HOSTS.STATIC}/source/:work/folio-:index.html`,
  ],

  // glossary -> static host
  [
    '/glossary/:id',
    `${HOSTS.STATIC}/glossary/named-entities/entity-:id.html`,
  ],

  // static passthroughs
  ['/catalogue/:path*', `${HOSTS.STATIC}/catalogue/:path*`],
  ['/frontend/:path*', `${HOSTS.STATIC}/frontend/:path*`],
  ['/images/:path*', `${HOSTS.STATIC}/images/:path*`],
  ['/audio/:path*', `${HOSTS.STATIC}/audio/:path*`],

  // /.well-known (assetlinks & others)
  [
    '/.well-known/:file.json',
    `${HOSTS.STATIC}/mobile-app/:file.json`,
  ],
  [
    '/.well-known/:file',
    `${HOSTS.STATIC}/mobile-app/:file.json`,
  ],

  // sitemaps
  ['/website-sitemap.xml', `${HOSTS.SITE}/sitemap.xml`],
  ['/translation-sitemap.xml', `${HOSTS.STATIC}/translation/sitemap.xml`],
  ['/source-sitemap.xml', `${HOSTS.STATIC}/source/sitemap.xml`],
  [
    '/glossary-sitemap.xml',
    `${HOSTS.STATIC}/glossary/named-entities/sitemap.xml`,
  ],

  // legacy site
  ['/old/:path*', `${HOSTS.STATIC}/old-site/:path*/index.html`],

  // catch-all to site with seed
  [
    '/:path((?!translation/|old|glossary/|source/|_next|public|assets|images|api|sitemap-0.xml).*)',
    `${HOSTS.SITE}/:path*${SEED_QUERY}`,
  ],
];

// In case you later need `has`, `missing`, `locale`, etc. for some rewrites:
const COMPLEX_REWRITES = [
  // currently empty – all existing rules fit the [source, destination] pattern
  // Add objects here if you later need advanced matching:
  // {
  //   source: '/something',
  //   has: [...],
  //   destination: '/other',
  // },
];

// Final rewrites config
const rewritesConfig = [
  ...SIMPLE_REWRITES.map(([source, destination]) => ({
    source,
    destination,
  })),
  ...COMPLEX_REWRITES,
];

// ---------------------------------------------------------------
// Next.js config
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
