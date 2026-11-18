/**
 * Markdown for AI agents.
 *
 * The plain-text (Markdown) edition of every translation, plus llms.txt and llms-full.txt, are generated
 * by 84000's Lamatic flows into the public "assets" storage bucket. This module decides which requests
 * get those files instead of the HTML page. The files themselves are served by src/pages/api/md/[...slug].js.
 *
 * Addresses (open to everyone):
 *   /llms.txt, /llms-full.txt                 site guide and complete index for AI tools
 *   /translation/toh21.md                     a translation (part 1, with a list of parts if the text is long)
 *   /translation/toh21/part-2.md              further parts of a long translation
 *   /translation/toh21/full.md                the whole translation in one file
 *   /translation/toh21/summary.md, faq.md     machine-generated overview and FAQ, marked as such
 *   /post/<name>.md, /about/<name>.md, ...    the plain-text edition of a website page (articles, news, events,
 *                                             people, documents, partnerships, ways to support), from md/site/
 *
 * Every translation page and the home page also send a Link header pointing to these files.
 *
 * Content negotiation on the normal page address (/translation/toh21, the website pages above, and the home page):
 *   - a request whose Accept header asks for text/markdown gets the Markdown edition;
 *   - so do known AI agents (ChatGPT, Claude, Perplexity, Common Crawl, ...);
 *   - search engine crawlers (Googlebot, Bingbot, ...) always get the HTML page, so search engines see
 *     exactly what readers see (no cloaking).
 * A page with no Markdown edition yet is served as normal (HTML), so a page address never breaks.
 */

/** AI assistants, AI search indexes and AI training crawlers that are served Markdown on page addresses. */
const AI_AGENTS =
  /GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-User|Claude-SearchBot|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|meta-externalagent|meta-externalfetcher|Amazonbot|cohere-ai|cohere-training-data-crawler|DuckAssistBot|MistralAI-User|AI2Bot|YouBot|AIWebIndex/i;

/** Search engine crawlers: always HTML, even if they also match an AI pattern. */
const SEARCH_CRAWLERS =
  /Googlebot|Google-InspectionTool|GoogleOther|Storebot-Google|AdsBot-Google|Mediapartners-Google|APIs-Google|bingbot|BingPreview|msnbot|adidxbot|Applebot|DuckDuckBot|YandexBot|Baiduspider|Slurp/i;

const SITE = "https://84000.co";
const LLMS_LINK = `<${SITE}/llms.txt>; rel="describedby"; type="text/plain"`;

const TOH = "toh[0-9a-z-]+";
const PAGE = new RegExp(`^/translation/(${TOH})$`);
const PAGE_MD = new RegExp(`^/translation/(${TOH})\\.md$`);
const FILE_MD = new RegExp(
  `^/translation/(${TOH})/(part-[1-9][0-9]{0,2}|full|summary|faq)\\.md$`,
);
const LLMS = /^\/(llms\.txt|llms-full\.txt)$/;

/** Website pages (Webflow) that have a plain-text edition in md/site/<path>.md, built by 84000's Lamatic flow 6. */
const SITE_PATH =
  "(?:(?:post|news|events|documents|partnerships|ways-to-support)/[a-z0-9][a-z0-9-]*|about/(?:person/)?[a-z0-9][a-z0-9-]*)";
export const SITE_PAGE_PATH = new RegExp(`^${SITE_PATH}$`);
const SITE_PAGE = new RegExp(`^/(${SITE_PATH})$`);
const SITE_PAGE_MD = new RegExp(`^/(${SITE_PATH})\\.md$`);

/** True when the request's Accept header asks for Markdown. */
export function acceptsMarkdown(request) {
  return /(^|,)\s*text\/markdown/i.test(request.headers.get("accept") || "");
}

/** True when the request asks for Markdown (Accept header) or comes from a known AI agent. */
export function wantsMarkdown(request) {
  if (acceptsMarkdown(request)) return true;
  const agent = request.headers.get("user-agent") || "";
  return AI_AGENTS.test(agent) && !SEARCH_CRAWLERS.test(agent);
}

/**
 * Where this request's Markdown comes from, or null to carry on as normal:
 * the file (for src/pages/api/md/[...slug].js) and whether it was chosen by negotiation on a page address.
 * Must run before the middleware replaces the user agent for proxied paths.
 */
export function markdownFile(request) {
  const { pathname } = request.nextUrl;
  let m = LLMS.exec(pathname);
  if (m) return { file: m[1], negotiated: false };
  m = PAGE_MD.exec(pathname);
  if (m) return { file: m[1], negotiated: false };
  m = FILE_MD.exec(pathname);
  if (m) return { file: `${m[1]}/${m[2]}`, negotiated: false };
  m = SITE_PAGE_MD.exec(pathname);
  if (m) return { file: `site/${m[1]}`, negotiated: false };
  if (!wantsMarkdown(request)) return null;
  m = PAGE.exec(pathname);
  if (m) return { file: m[1], negotiated: true };
  m = SITE_PAGE.exec(pathname);
  if (m) return { file: `site/${m[1]}`, negotiated: true };
  if (pathname === "/") return { file: "home", negotiated: true };
  return null;
}

/**
 * The URL to rewrite to. A rewritten request keeps its original path in the API route, so the file is passed as a
 * query parameter.
 */
export function markdownRewriteUrl(request) {
  const target = markdownFile(request);
  if (!target) return null;
  const url = new URL("/api/md/serve", request.url);
  url.search = "";
  url.searchParams.set("file", target.file);
  if (target.negotiated) url.searchParams.set("negotiated", "1");
  return url;
}

// Where next.config.mjs sends these pages (HOSTS.READING and HOSTS.SITE there); keep them the same.
const READING_ROOM = "https://reading-room.84000.co";
const BRAND_SITE = "https://brand.84000.co";

/**
 * Translation pages and the home page carry a Link header (RFC 8288) pointing to the site guide (llms.txt) and the
 * page's Markdown edition. A header set on NextResponse.next() does not reach a page that next.config.mjs proxies to
 * another host, so for these two kinds of page the middleware does the same rewrite itself and sets the header on it.
 * Returns { url, link, proxyUserAgent } or null.
 */
export function linkedPage(request) {
  const { pathname, search } = request.nextUrl;
  const m = PAGE.exec(pathname);
  if (m) {
    return {
      url: new URL(`${READING_ROOM}${pathname}${search}`),
      link: `<${SITE}/translation/${m[1]}.md>; rel="alternate"; type="text/markdown", ${LLMS_LINK}`,
      proxyUserAgent: true,
    };
  }
  if (pathname === "/") {
    const url = new URL(`${BRAND_SITE}/${search}`);
    url.searchParams.set("seed", "true");
    return { url, link: LLMS_LINK, proxyUserAgent: false };
  }
  return null;
}

export const NOT_FOUND_MARKDOWN = `# Page not found

There is no page at this address on 84000.co. It may have moved, or the address may be mistyped.

- [Guide to 84000 for AI tools](${SITE}/llms.txt)
- [Every published translation](${SITE}/llms-full.txt)
- [All website pages](${SITE}/sitemap.xml)
`;

/**
 * For a request that asks for Markdown (Accept: text/markdown) on a Webflow page: asks Webflow first whether the page
 * exists. If it doesn't, the answer is a short Markdown "not found" page with links to llms.txt and the sitemap,
 * instead of the website's HTML error page. Resolves to null when the page exists or the check fails, so the request
 * carries on as normal. Browsers and search engines don't send this Accept header, so they never reach this check.
 */
export async function markdownNotFound(request, proxyUserAgent) {
  try {
    const probe = await fetch(
      `${BRAND_SITE}${request.nextUrl.pathname}?seed=true`,
      {
        method: "HEAD",
        redirect: "manual",
        headers: { "user-agent": proxyUserAgent },
      },
    );
    if (probe.status !== 404) return null;
  } catch {
    return null;
  }
  return new Response(NOT_FOUND_MARKDOWN, {
    status: 404,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "private, no-store",
      vary: "Accept",
      "x-content-type-options": "nosniff",
    },
  });
}
