/** @type {import('next').NextConfig} */

const staticHost = 'https://static.84000.co';
const searchHost = 'https://read.84000-translate.org';
const siteHost = 'https://site.84000.co';
const seed = '?seed=true';

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        // Resolve UT ids
        source: '/translation/UT:id',
        destination: '/translation-redirect/UT:id',
        permanent: true,
      },
      {
        // Resolve purls
        source: '/resource/core/WAE:id',
        destination: '/translation-redirect/WAE:id',
        permanent: true,
      },
      {
        // Support legacy links with .html extension
        source: '/translation/:id.html',
        destination: '/translation/:id',
        permanent: true,
      },
      {
        // Resolve UT ids
        source: '/source/UT:id',
        destination: '/source-redirect/UT:id',
        permanent: true,
      },
      {
        // Resolve UT ids
        source: '/source/UT:id/folio/:index',
        destination: '/source-redirect/UT:id/folio/:index',
        permanent: true,
      },
      {
        // PDFs
        source: '/data/:slug.pdf',
        destination: '/pdf-redirect/:slug.pdf',
        permanent: true,
      },
      {
        // epubs
        source: '/data/:slug.epub',
        destination: '/epub-redirect/:slug.pdf',
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
        // Support legacy links with .html extension and page parameter
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
      {
        // Truncate "entity" from entity-id
        source: '/glossary/entity-:id.html',
        destination: '/glossary/:id',
        permanent: true,
      },
      {
        // Truncate "entity" from entity-id
        source: '/glossary/entity-:id',
        destination: '/glossary/:id',
        permanent: true,
      },
      {
        // Glossary search
        source: '/glossary/search.html',
        destination: '/glossary-search',
        permanent: true,
      },
      /*{
        // Knowledgebase
        source: '/knowledgebase/:path',
        destination: '/knowledge-base-articles',
        permanent: false,
      },*/
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
        // /translation/toh1-1/UT22084-029-001-chapter-1/toh3808 -> /translation/toh1-1/toh3808/UT22084-001-001-chapter-1.html
        source: '/translation/:work/:part/:commentary',
        destination: `${ staticHost }/translation/:work/commentary-:commentary/:part.html`,
      },
      {
        // /translation/toh1-1/UT22084-001-001-chapter-1 -> /translation/toh1-1/UT22084-001-001-chapter-1.html
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
        source: '/catalogue/:path*',
        destination: `${ staticHost }/catalogue/:path*`,
      },
      {
        source: '/frontend/:path*',
        destination: `${ staticHost }/frontend/:path*`,
      },
      {
        source: '/images/:path*',
        destination: `${ staticHost }/images/:path*`,
      },
      {
        source: '/audio/:path*',
        destination: `${ staticHost }/audio/:path*`,
      },
      {
        // /.well-known/assetlinks.json -> /mobile-app/assetlinks.json
        source: '/.well-known/:file.json',
        destination: `${ staticHost }/mobile-app/:file.json`,
      },
      {
        // /.well-known/apple-app-site-association -> /mobile-app/apple-app-site-association.json
        source: '/.well-known/:file',
        destination: `${ staticHost }/mobile-app/:file.json`,
      },
      // {
      //   // /robots.txt -> /catalogue/robots.txt
      //   source: '/robots.txt',
      //   destination: `${ staticHost }/catalogue/robots.txt`,
      // },
      {
        source: '/website-sitemap.xml',
        destination: `${ siteHost }/sitemap.xml`,
      },
      {
        source: '/translation-sitemap.xml',
        destination: `${ staticHost }/translation/sitemap.xml`,
      },
      {
        source: '/source-sitemap.xml',
        destination: `${ staticHost }/source/sitemap.xml`,
      },
      {
        source: '/glossary-sitemap.xml',
        destination: `${ staticHost }/glossary/named-entities/sitemap.xml`,
      },
      {
        source: '/old/:path*',
        destination: `${ staticHost }/old-site/:path*/index.html`,
      },
      {
        source: "/:path((?!translation/|old|glossary/|source/|_next|public|assets|images|api|sitemap-0.xml).*)",
        destination: `${ siteHost }/:path*${ seed }`
      },
    ];
  },
};

export default nextConfig;
