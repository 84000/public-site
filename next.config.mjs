/** @type {import('next').NextConfig} */

const HOSTS = {
  STATIC: 'https://reading-room.84000.co', //update this reading room  
  SEARCH: 'https://read.84000-translate.org', // remove
  SITE: 'https://brand.84000.co', // change to Brand
  READER: 'https://reader.84000.co', 
};

const SEED_QUERY = '?seed=true';

// ---------------------------------------------------------------
// Redirects
// ---------------------------------------------------------------

// List of specific toh IDs to send to reader.84000.co
const READER_TOH_IDS = [
  'toh23',
  'toh519',
  'toh560',
  'toh529',
  'toh242',
  'toh541',
  'toh769',
  'toh971',
  'toh748',
  'toh948',
  'toh140',
  'toh525',
  'toh914',
  'toh823',
  'toh1106',
  'toh4418',
  'toh318',
  'toh98',
  'toh721',
  'toh204',
  'toh825',
  'toh4417',
  'toh764',
  'toh970',
  'toh634',
  'toh874',
  'toh710',
  'toh930',
  'toh417',
  'toh418',
  'toh1183',
  'toh1189',
];

// Simple redirects as [source, destination, permanent?]
/** @type {[string, string, boolean?][]} */
const SIMPLE_REDIRECTS = [
  // Resolve UT ids
  ['/translation/UT:id', '/translation-redirect/UT:id', true],  
  ['/resource/core/WAE:id', '/translation-redirect/WAE:id', true],

  // Legacy translation .html
  ['/translation/:id.html', '/translation/:id', true],

  // Source UT ids
  ['/source/UT:id', '/source-redirect/UT:id', true], // translation
  ['/source/UT:id/folio/:index', '/source-redirect/UT:id/folio/:index', true], // translation

  // PDFs
  ['/data/:slug.pdf', '/pdf-redirect/:slug.pdf', true], // supabase patterns https://api.84000.co/storage/v1/object/public/assets/pdf/toh53.pdf

  // epubs
  ['/data/:slug.epub', '/epub-redirect/:slug.epub', true], // supabase patterns https://api.84000.co/storage/v1/object/public/assets/epub/toh53.epub

  // Glossary
  ['/glossary/entity-:id.html', '/glossary/:id', true], // scholarroom/gloassart
  ['/glossary/entity-:id', '/glossary/:id', true], // scholarroom/gloassart
  ['/glossary/search.html', '/glossary-search', true], // scholarroom/gloassart

  // -------- NEW: specific translation IDs -> reader.84000.co --------
  // /translation/tohXXX  -> https://reader.84000.co/tohXXX
  // /translation/tohXXX/anything -> https://reader.84000.co/tohXXX/anything
  ...READER_TOH_IDS.map((id) => [
    `/translation/${id}/:path*`,
    `${HOSTS.READER}/${id}/:path*`,
    true,
  ]), // remove this rule
  ...READER_TOH_IDS.map((id) => [
    `/translation/${id}`,
    `${HOSTS.READER}/${id}`,
    true,
  ]), // remove this rule
];

// Redirects that need extra fields (`has`, etc.) stay as objects
const COMPLEX_REDIRECTS = [
  {
    // Legacy links with .html extension and ref-index parameter
    source: '/source/:id.html', // revisit this
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
    source: '/source/:id.html', // revisit this
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
// Rewrites (unchanged from previous tuple version)
// ---------------------------------------------------------------

/** @type {[string, string][]} */
const SIMPLE_REWRITES = [
  [
    '/translation/:path*/index/:rest+',
    `${HOSTS.SEARCH}/translation/:path*/index/:rest+`,
  ], // gone - redirect to readig room
  ['/glossary-embedded/:path*', `${HOSTS.SEARCH}/glossary-embedded/:path*`], // gone - redirect to scholar room
  ['/search-tm-embedded.html', `${HOSTS.SEARCH}/search-tm-embedded.html`], // gone - redirect to scholar room
  [
    '/translation/:work/:part/:commentary',
    `${HOSTS.STATIC}/translation/:work/commentary-:commentary/:part.html`, //gone -> redirect back to base path
  ],
  ['/translation/:work/:part', `${HOSTS.STATIC}/translation/:work/:part.html`], // gone - redirect to reading room
  [
    '/translation/:work.:format',
    `${HOSTS.STATIC}/translation/:work/:work.:format`, //gone -> redirect back to base path
  ], // gone
  ['/translation/:work', `${HOSTS.STATIC}/translation/:work`], //gone -> redirect back to base path
  [
    '/source/:work/folio/:index',
    `${HOSTS.STATIC}/source/:work/folio-:index.html`, //gone -> redirect back to reading room path
  ],
  ['/glossary/:id', `${HOSTS.STATIC}/glossary/named-entities/entity-:id.html`], // gone - redirect to scholar room
  ['/catalogue/:path*', `${HOSTS.STATIC}/catalogue/:path*`], //gone -> redirect back to reading room
  ['/frontend/:path*', `${HOSTS.STATIC}/frontend/:path*`], //gone -> redirect back to reading room
  ['/images/:path*', `${HOSTS.STATIC}/images/:path*`], //gone -> redirect back to reading room
  ['/audio/:path*', `${HOSTS.STATIC}/audio/:path*`], //gone -> redirect back to reading room
  ['/.well-known/:file.json', `${HOSTS.STATIC}/mobile-app/:file.json`], 
  ['/.well-known/:file', `${HOSTS.STATIC}/mobile-app/:file.json`],
  ['/website-sitemap.xml', `${HOSTS.SITE}/sitemap.xml`], // gone -> stop google 
  ['/translation-sitemap.xml', `${HOSTS.STATIC}/translation/sitemap.xml`],
  ['/source-sitemap.xml', `${HOSTS.STATIC}/source/sitemap.xml`],
  [
    '/glossary-sitemap.xml',
    `${HOSTS.STATIC}/glossary/named-entities/sitemap.xml`,
  ],
  ['/old/:path*', `${HOSTS.STATIC}/old-site/:path*/index.html`],
  [
    '/:path((?!translation/|old|glossary/|source/|_next|public|assets|images|api|sitemap-0.xml).*)',
    `${HOSTS.SITE}/:path*${SEED_QUERY}`,
  ], // reading room 
];

const COMPLEX_REWRITES = [];

const rewritesConfig = [
  ...SIMPLE_REWRITES.map(([source, destination]) => ({ source, destination })),
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
