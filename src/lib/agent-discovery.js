/**
 * Agent discovery files: an Agent Skills index with one skill that explains how to find, read and cite 84000's
 * translations, and an AI catalog (ARD) listing what 84000 offers AI agents.
 *
 *   /.well-known/agent-skills/index.json                          Agent Skills Discovery RFC v0.2.0
 *   /.well-known/agent-skills/read-84000-translations/SKILL.md    the skill
 *   /.well-known/ai-catalog.json, /.well-known/ard.json           ARD, ai-catalog data model
 *
 * next.config.mjs sends every /.well-known/ address to the Reading Room, so the middleware answers these few itself.
 * Every other /.well-known/ address is unchanged.
 */

const SITE = "https://84000.co";
const SKILL_NAME = "read-84000-translations";
const SKILL_PATH = `/.well-known/agent-skills/${SKILL_NAME}/SKILL.md`;
const SKILL_DESCRIPTION =
  "Find, read and cite 84000's English translations of the Tibetan Buddhist canon (Kangyur and Tengyur) as plain text.";

const SKILL_MD = `---
name: ${SKILL_NAME}
description: ${SKILL_DESCRIPTION} Use it for questions about a Buddhist sutra, tantra or treatise, a Toh number, or a quote from an 84000 translation.
---

# Reading 84000 translations

84000 (${SITE}) is a nonprofit that publishes English translations of the Tibetan Buddhist canon: the Kangyur, the
words of the Buddha, and the Tengyur, the commentaries. Each text has a Tohoku catalogue number, written "Toh 21" in
titles and \`toh21\` in addresses.

## Find a text

- ${SITE}/llms.txt is a short guide to the site for AI tools.
- ${SITE}/llms-full.txt lists every published translation with its Toh number and section of the canon, and links to
  its plain-text edition where there is one.
- Some works are listed under two Toh numbers, for example Toh 21 and Toh 531. One file covers the whole work, under
  the lower number (toh21.md), and lists every Toh number with its place in the canon; toh531.md points to it.

## Read a text

- ${SITE}/translation/toh21.md is the plain-text edition in Markdown: the licence and a citation first, then a
  machine-generated overview ("At a glance"), then 84000's own summary, introduction, translation, notes and glossary.
- Long texts are split into parts. toh9.md is part 1 and lists every part with the range of passages it holds. Open
  the part you need, for example ${SITE}/translation/toh9/part-44.md
- ${SITE}/translation/toh9/full.md is the whole translation in one file, without the machine-generated overview. It is
  large for long texts.
- summary.md and faq.md (for example ${SITE}/translation/toh21/summary.md) hold the machine-generated summary and
  questions on their own. They are labelled as not yet reviewed by an 84000 editor, so quote the translation itself for
  anything that matters.
- The normal page address (${SITE}/translation/toh21) also answers with the plain-text edition when asked for
  text/markdown.
- Not every text has a plain-text edition yet. If a .md address returns 404, read the normal page instead.

## Quote and cite

- Passages carry the same labels as on the website, for example 1.3. Each label is followed by the passage's
  permanent ID in square brackets, and by a Toh number when the passage belongs to one Toh only: **1.3** [ID] or
  **1.3** [ID, toh535]. To link to one passage, use ${SITE}/entity/passage/ID?toh=TOH, with the file's own Toh number
  when none is given.
- In the text, [n.12] marks a note. The notes come at the end of the file, or of the part. Leave note markers and
  passage IDs out of quotations.
- Cite the title, the Toh number, the passage label and its link, for example: The Heart of the Perfection of Wisdom,
  the Blessed Mother (Toh 21), 1.3, ${SITE}/entity/passage/851efcc7-c043-4084-9a70-a2fc8d947a2e?toh=toh21
- The licence and a ready-made citation are at the top of every file. Follow them.
`;

const CATALOG = {
  specVersion: "1.0",
  host: {
    displayName: "84000: Translating the Words of the Buddha",
    identifier: "did:web:84000.co",
  },
  entries: [
    {
      identifier: "urn:air:84000.co:guide:llms-txt",
      displayName: "84000 site guide for AI tools (llms.txt)",
      type: "text/plain",
      url: `${SITE}/llms.txt`,
      representativeQueries: [
        "what is 84000",
        "where can I read the Kangyur in English",
        "how do I cite an 84000 translation",
      ],
    },
    {
      identifier: "urn:air:84000.co:index:translations",
      displayName: "Index of every published 84000 translation (llms-full.txt)",
      type: "text/plain",
      url: `${SITE}/llms-full.txt`,
      representativeQueries: [
        "English translation of the Heart Sutra",
        "which 84000 translation is Toh 9",
        "list of translated texts in the Tengyur",
      ],
    },
    {
      identifier: `urn:air:84000.co:skill:${SKILL_NAME}`,
      displayName: "Skill: find, read and cite 84000 translations",
      type: "text/markdown",
      url: `${SITE}${SKILL_PATH}`,
      representativeQueries: [
        "quote passage 1.3 of the Heart Sutra",
        "read a long sutra part by part",
        "cite a passage from an 84000 translation",
      ],
    },
  ],
};

const PATHS = new Set([
  "/.well-known/agent-skills/index.json",
  SKILL_PATH,
  "/.well-known/ai-catalog.json",
  "/.well-known/ard.json",
]);

/** True for the addresses this module answers. */
export function isAgentDiscoveryPath(pathname) {
  return PATHS.has(pathname);
}

async function sha256(text) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function reply(body, type) {
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": type,
      "access-control-allow-origin": "*",
      "x-content-type-options": "nosniff",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

/** The answer for an address that isAgentDiscoveryPath() accepts. */
export async function agentDiscoveryResponse(pathname) {
  if (pathname === SKILL_PATH)
    return reply(SKILL_MD, "text/markdown; charset=utf-8");
  if (pathname === "/.well-known/agent-skills/index.json") {
    const index = {
      $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
      skills: [
        {
          name: SKILL_NAME,
          type: "skill-md",
          description: SKILL_DESCRIPTION,
          url: SKILL_PATH,
          digest: `sha256:${await sha256(SKILL_MD)}`,
        },
      ],
    };
    return reply(
      JSON.stringify(index, null, 2),
      "application/json; charset=utf-8",
    );
  }
  return reply(
    JSON.stringify(CATALOG, null, 2),
    "application/json; charset=utf-8",
  );
}
