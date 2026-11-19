// Serves the Markdown edition of translations and website pages, llms.txt and llms-full.txt from the public "assets" storage
// bucket, where 84000's Lamatic flows write them. Requests arrive here from src/middleware.js (see
// src/lib/markdown-for-agents.js for the public addresses). Only the paths below can be read: nothing
// else in the bucket is reachable through this route.
//
// Edge runtime: the file is streamed, so even the largest full.md (over 10 MB) is not limited by the
// 4.5 MB response cap of serverless functions.
import { PROXY_USER_AGENT } from "@/lib/proxy-request";
import { NOT_FOUND_MARKDOWN, SITE_PAGE_PATH } from "@/lib/markdown-for-agents";

export const config = { runtime: "edge" };

const STORAGE =
  process.env.AGENT_TEXT_STORAGE_URL ||
  "https://api.84000.co/storage/v1/object/public/assets";
const READING = "https://reading-room.84000.co";
const BRAND = "https://brand.84000.co";
const SITE = "https://84000.co";
const TOH = /^toh[0-9a-z-]+$/;
const FILE = /^(part-[1-9][0-9]{0,2}|full|summary|faq)$/;
const MARKDOWN = "text/markdown; charset=utf-8";
const TEXT = "text/plain; charset=utf-8";

// Lamatic saves text files with ".txt" added: md/en/toh21/page.md is stored as md/en/toh21/page.md.txt.
function target(slug) {
  const [first, second, ...rest] = slug;
  if (first === "site") {
    const page = slug.slice(1).join("/");
    if (!SITE_PAGE_PATH.test(page)) return null;
    return {
      path: `md/site/${page}.md.txt`,
      type: MARKDOWN,
      canonical: `${SITE}/${page}`,
      site: page,
    };
  }
  if (rest.length) return null;
  if (!second && (first === "llms.txt" || first === "llms-full.txt"))
    return { path: `llms/${first}`, type: TEXT };
  if (!second && first === "home")
    return { path: "llms/llms.txt", type: MARKDOWN, canonical: `${SITE}/` };
  if (!TOH.test(first || "")) return null;
  const canonical = `${SITE}/translation/${first}`;
  if (!second || second === "part-1")
    return {
      path: `md/en/${first}/page.md.txt`,
      type: MARKDOWN,
      canonical,
      toh: first,
    };
  if (!FILE.test(second)) return null;
  return {
    path: `md/en/${first}/${second}.md.txt`,
    type: MARKDOWN,
    canonical,
    toh: first,
  };
}

function notFound(message) {
  return new Response(message + "\n", {
    status: 404,
    headers: {
      "content-type": TEXT,
      "cache-control": "public, max-age=60, s-maxage=300",
    },
  });
}

export default async function handler(request) {
  const url = new URL(request.url);
  // From the middleware the file comes as ?file= (a rewritten request keeps its original path here);
  // a direct request to /api/md/<file> also works.
  const file =
    url.searchParams.get("file") || url.pathname.replace(/^\/api\/md\/?/, "");
  const slug = file.split("/").filter(Boolean);
  const negotiated = url.searchParams.get("negotiated") === "1";
  const t = target(slug);
  if (!t) return notFound("Not found.");

  const upstream = await fetch(`${STORAGE}/${t.path}`, {
    headers: { accept: "*/*" },
  });

  if (!upstream.ok) {
    // A page address must never break: if this text has no Markdown edition yet, serve the normal page.
    if (negotiated && t.toh) {
      const page = await fetch(`${READING}/translation/${t.toh}`, {
        headers: { "user-agent": PROXY_USER_AGENT },
      });
      return new Response(page.body, {
        status: page.status,
        headers: {
          "content-type":
            page.headers.get("content-type") || "text/html; charset=utf-8",
          "cache-control": "private, no-store",
          vary: "Accept, User-Agent",
        },
      });
    }
    // A website page with no Markdown edition: ask Webflow whether the page exists. If it doesn't, the answer is
    // the Markdown "not found" page; if it does, a negotiated request gets the normal page.
    if (t.site) {
      const page = await fetch(`${BRAND}/${t.site}?seed=true`, {
        method: negotiated ? "GET" : "HEAD",
        headers: { "user-agent": PROXY_USER_AGENT },
      });
      if (page.status === 404) {
        return new Response(NOT_FOUND_MARKDOWN, {
          status: 404,
          headers: {
            "content-type": MARKDOWN,
            "x-content-type-options": "nosniff",
            "cache-control": negotiated
              ? "private, no-store"
              : "public, max-age=60, s-maxage=300",
            vary: "Accept, User-Agent",
          },
        });
      }
      if (negotiated) {
        return new Response(page.body, {
          status: page.status,
          headers: {
            "content-type":
              page.headers.get("content-type") || "text/html; charset=utf-8",
            "cache-control": "private, no-store",
            vary: "Accept, User-Agent",
          },
        });
      }
    }
    if (upstream.status === 404 || upstream.status === 400) {
      return notFound(
        t.toh
          ? `No plain-text edition of ${t.toh} yet. The translation is at ${SITE}/translation/${t.toh}`
          : t.site
            ? `No plain-text edition of this page yet. The page is at ${SITE}/${t.site}`
            : "Not found.",
      );
    }
    return new Response("Temporarily unavailable.\n", {
      status: 502,
      headers: { "content-type": TEXT, "cache-control": "no-store" },
    });
  }

  const headers = {
    "content-type": t.type,
    "access-control-allow-origin": "*",
    "x-content-type-options": "nosniff",
    // Negotiated answers share their address with the HTML page, so no shared cache may keep them.
    "cache-control": negotiated
      ? "private, no-store"
      : "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
  };
  if (negotiated) headers.vary = "Accept, User-Agent";
  if (t.canonical) headers.link = `<${t.canonical}>; rel="canonical"`;
  return new Response(upstream.body, { status: 200, headers });
}
