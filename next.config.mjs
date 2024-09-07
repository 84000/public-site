/** @type {import('next').NextConfig} */

const staticHost = 'https://static.84000.co';
const searchHost = 'https://read.84000-translate.org';
const siteHost = 'https://site.84000.co';

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        // Resolve UT ids
        source: '/translation/UT:path',
        destination: '/translation-redirect/UT:path',
        permanent: false,
      },
      {
        // Support legacy links with .html extension
        source: '/translation/:id.html',
        destination: '/translation/:id',
        permanent: true,
      },
      {
        // Support legacy links with .html extension and ref-index parameter
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
        // Truncate "entity" from entity-id
        source: '/glossary/entity-:id.html',
        destination: '/glossary/:id',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        // /glossary-embedded/search.html -> /glossary-embedded/search.html
        source: '/glossary-embedded/:path*',
        destination: `${ searchHost }/glossary-embedded/:path*`,
      },
      {
        // /search-tm-embedded.html -> /search-tm-embedded.html
        source: '/search-tm-embedded.html',
        destination: `${ searchHost }/search-tm-embedded.html`,
      },
      {
        // /translation/toh1-1/UT22084-029-001/toh3808 -> /translation/toh1-1/toh3808/UT22084-001-001.html
        source: '/translation/:work/:part/:commentary',
        destination: `${ staticHost }/translation/:work/commentary-:commentary/:part.html`,
      },
      {
        // /translation/toh1-1/UT22084-001-001 -> /translation/toh1-1/UT22084-001-001.html
        source: '/translation/:work/:part',
        destination: `${ staticHost }/translation/:work/:part.html`,
      },
      {
        // translation/toh52.pdf -> translation/toh52/toh52.pdf
        source: '/translation/:work.:format',
        destination: `${ staticHost }/translation/:work/:work.:format`,
      },
      {
        // /translation/toh1-1 -> /translation/toh1-1/index.html
        source: '/translation/:work',
        destination: `${ staticHost }/translation/:work/index.html`,
      },
      {
        // /source/toh1-1/folio/1 -> /source/toh1-1/folio-1.html
        source: '/source/:work/folio/:index',
        destination: `${ staticHost }/source/:work/folio-:index.html`,
      },
      {
        // /glossary/123 -> /glossary/named-entities/entity-123.html
        source: '/glossary/:id',
        destination: `${ staticHost }/glossary/named-entities/entity-:id.html`,
      },
      {
        source: '/frontend/:path*',
        destination: `${ staticHost }/frontend/:path*`,
      },
      {
        source: '/old/:path*',
        destination: `${ staticHost }/old-site/:path*/index.html`,
      },
      {
        source: "/:path((?!translation/|old|glossary/|_next|public|assets|images|api|sitemap-0.xml).*)",
        destination: `${ siteHost }/:path*`
      },
    ];
  },
};

export default nextConfig;