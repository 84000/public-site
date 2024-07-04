/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        // Support legacy links with .html extension
        source: '/translation/:id.html',
        destination: '/translation/:id',
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
        source: '/translation/:id.:format',
        destination: 'https://data-static.vercel.app/translation/:id/:id.:format',
      },
      {
         source: '/translation/:path/:id',
         destination: 'https://data-static.vercel.app/translation/:path*/:id.html',
         // /translation/toh1-1/UT22084-029-001/toh3808 -> /translation/toh1-1/toh3808/UT22084-001-001.html
         source: '/translation/:work/:part/:commentary',
         destination: 'https://data-static.vercel.app/translation/:work/commentary-:commentary/:part.html',
      },
      {
         // /translation/toh1-1/UT22084-001-001 -> /translation/toh1-1/UT22084-001-001.html
         source: '/translation/:work/:part',
         destination: 'https://data-static.vercel.app/translation/:work/:part.html',
      },
      {
      	 // /translation/toh1-1.pdf -> /translation/toh1-1/toh1-1.pdf
         source: '/translation/:work([^\.]*):extension(\.pdf|\.epub)',
         destination: 'https://data-static.vercel.app/translation/:work/:work:extension',
      },

      {
      	 // /translation/toh1-1 -> /translation/toh1-1/index.html
         source: '/translation/:work',
         destination: 'https://data-static.vercel.app/translation/:work/index.html',
      },
      {
      	// /source/toh1-1/folio/1 -> /source/toh1-1/folio-1.html
        source: '/source/:work/folio/:index',
        destination: 'https://data-static.vercel.app/source/:work/folio-:index.html',
      },
      {
      	// /glossary/123 -> /glossary/named-entities/entity-123.html
        source: '/glossary/:id',
        destination: 'https://data-static.vercel.app/glossary/named-entities/entity-:id.html',
      },
      {
        source: '/frontend/:path*',
        destination: 'https://data-static.vercel.app/frontend/:path*',
      },
      {
        source: '/old/:path*',
        destination: 'https://data-static.vercel.app/old-site/:path*/index.html',
      },
      {
        source: "/:path((?!translation|old|glossary|_next|public|assets|images|api|sitemap-0.xml).*)",
        destination: "https://84000.webflow.io/:path*"
      },
    ];
  },
};

export default nextConfig;
