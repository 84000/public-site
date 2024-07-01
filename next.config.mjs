/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/translation/:path.html',
        destination: '/translation/:path',
        permanent: true,
      },
      {
        source: '/glossary/entity-:path.html',
        destination: '/glossary/:path',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
         source: '/translation/:path/:id',
         destination: 'https://data-static.vercel.app/translation/:path*/:id.html',
      },
      {
        source: '/source/:path*/folio/:id',
        destination: 'https://data-static.vercel.app/source/:path*/folio-:id.html',
      },
      {
      source: '/translation/:path*',
      destination: 'https://data-static.vercel.app/translation/:path*',
      },
      {
        source: '/frontend/:path*',
        destination: 'https://data-static.vercel.app/frontend/:path*',
      },
      {
        source: '/glossary/:path*',
        destination: 'https://data-static.vercel.app/glossary/named-entities/entity-:path*.html',
      },
      {
        source: '/old/:path*',
        destination: 'https://data-static.vercel.app/old-site/:path*/index.html',
      },
      {source: "/:path((?!translation|old|glossary|_next|public|assets|images|api|sitemap-0.xml).*)",
        destination: "https://84000.vercel.app/:path*"
      },
    ];
  },
};

export default nextConfig;
