const BRAND_SITEMAP_URL = 'https://brand.84000.co/sitemap.xml';
const REVALIDATE_SECONDS = 3600;

export async function GET() {
  const res = await fetch(BRAND_SITEMAP_URL, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    return new Response('Sitemap unavailable', { status: res.status });
  }

  const webflowXml = await res.text();
  const rewritten = webflowXml.replaceAll('brand.84000.co', '84000.co');

  const headers = new Headers();
  const contentType = res.headers.get('Content-Type');
  if (contentType) {
    headers.set('Content-Type', contentType);
  } else {
    headers.set('Content-Type', 'application/xml');
  }

  return new Response(rewritten, { headers });
}
