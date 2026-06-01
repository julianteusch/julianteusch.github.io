import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const ORCID = process.env.PUBLICATIONS_ORCID || "0000-0002-4103-8430";
const OUTPUT = process.env.PUBLICATIONS_OUTPUT || "data/publications.json";
const SITE_URL = (process.env.PUBLICATIONS_SITE_URL || "https://julianteusch.github.io").replace(/\/$/, "");
const OPENALEX_URL = new URL("https://api.openalex.org/works");

OPENALEX_URL.searchParams.set("filter", `author.orcid:${ORCID}`);
OPENALEX_URL.searchParams.set("sort", "publication_year:desc,publication_date:desc");
OPENALEX_URL.searchParams.set("per-page", "100");
OPENALEX_URL.searchParams.set(
  "select",
  [
    "id",
    "doi",
    "title",
    "publication_year",
    "publication_date",
    "primary_location",
    "authorships",
    "biblio",
    "cited_by_count",
    "is_retracted",
    "abstract_inverted_index",
  ].join(","),
);

const response = await fetch(OPENALEX_URL, {
  headers: {
    "User-Agent": "julianteusch.github.io publication updater (mailto:julian.teusch@tu-clausthal.de)",
  },
});

if (!response.ok) {
  throw new Error(`OpenAlex request failed: ${response.status} ${response.statusText}`);
}

const payload = await response.json();
const seen = new Set();

const titleKey = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const cleanDoi = (doi) => doi?.replace(/^https?:\/\/doi\.org\//i, "").trim() || null;
const doiUrl = (doi) => (doi ? `https://doi.org/${doi}` : null);
const slugify = (title, year) => `${year}-${title}`
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "")
  .slice(0, 92);

const venueOverrides = new Map([
  ["transportation research procedia", "Transportation Research Procedia"],
  [
    "transportation research part e logistics and transportation review",
    "Transportation Research Part E: Logistics and Transportation Review",
  ],
  ["ieee open journal of intelligent transportation systems", "IEEE Open Journal of Intelligent Transportation Systems"],
]);

function formatVenue(name) {
  if (!name) return "";
  return venueOverrides.get(name.toLowerCase()) || name;
}

function formatPages(biblio) {
  if (!biblio) return "";
  const first = biblio.first_page;
  const last = biblio.last_page;
  if (first && last && first !== last) return `${first}-${last}`;
  return first || "";
}

function formatAuthors(authorships) {
  return (authorships || [])
    .map((entry) => entry.author?.display_name)
    .filter(Boolean);
}

function formatAbstract(index) {
  if (!index) return "";
  const words = [];
  for (const [word, positions] of Object.entries(index)) {
    for (const position of positions) {
      words[position] = word;
    }
  }
  return words.join(" ").replace(/\s+/g, " ").trim();
}

function firstAndLastPage(pages) {
  if (!pages) return { first: "", last: "" };
  const parts = String(pages).split(/[-–—]/).map((part) => part.trim()).filter(Boolean);
  return { first: parts[0] || "", last: parts[1] || "" };
}

const publications = (payload.results || [])
  .filter((work) => !work.is_retracted)
  .filter((work) => work.primary_location?.is_published === true)
  .filter((work) => cleanDoi(work.doi))
  .map((work) => {
    const doi = cleanDoi(work.doi);
    const source = work.primary_location?.source || {};
    const slug = slugify(work.title, work.publication_year);
    return {
      title: work.title,
      year: work.publication_year,
      date: work.publication_date,
      slug,
      page_url: `${SITE_URL}/publications/${slug}/`,
      authors: formatAuthors(work.authorships),
      venue: formatVenue(source.display_name),
      doi,
      url: doiUrl(doi) || work.primary_location?.landing_page_url || work.id,
      volume: work.biblio?.volume || "",
      issue: work.biblio?.issue || "",
      pages: formatPages(work.biblio),
      citations: work.cited_by_count ?? 0,
      abstract: formatAbstract(work.abstract_inverted_index),
    };
  })
  .filter((work) => {
    const key = work.doi || titleKey(work.title);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  })
  .sort((a, b) => {
    const byDate = String(b.date || "").localeCompare(String(a.date || ""));
    if (byDate) return byDate;
    return String(a.title).localeCompare(String(b.title));
  });

let updatedAt = new Date().toISOString();

try {
  const existing = JSON.parse(await readFile(OUTPUT, "utf8"));
  if (JSON.stringify(existing.publications || []) === JSON.stringify(publications)) {
    updatedAt = existing.updated_at || updatedAt;
  }
} catch {
  // No existing data file yet.
}

const data = {
  source: "OpenAlex",
  source_url: `https://openalex.org/authors/orcid:${ORCID}`,
  orcid: ORCID,
  updated_at: updatedAt,
  publications,
};

await mkdir(path.dirname(OUTPUT), { recursive: true });
await writeFile(`${OUTPUT}.tmp`, `${JSON.stringify(data, null, 2)}\n`, "utf8");
await rename(`${OUTPUT}.tmp`, OUTPUT);
await writePublicationPages(publications);
await writeSitemap(publications);
await writeRobots();

console.log(`Wrote ${publications.length} published works to ${OUTPUT}`);

async function writePublicationPages(items) {
  await rm("publications", { recursive: true, force: true });
  for (const publication of items) {
    const dir = path.join("publications", publication.slug);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "index.html"), renderPublicationPage(publication), "utf8");
  }
}

async function writeSitemap(items) {
  const urls = [
    `${SITE_URL}/`,
    ...items.map((publication) => publication.page_url),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join("\n") +
    `\n</urlset>\n`;
  await writeFile("sitemap.xml", body, "utf8");
}

async function writeRobots() {
  await writeFile("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`, "utf8");
}

function renderPublicationPage(publication) {
  const pageTitle = `${publication.title} | Julian Teusch`;
  const { first, last } = firstAndLastPage(publication.pages);
  const citationMeta = [
    ["citation_title", publication.title],
    ...publication.authors.map((author) => ["citation_author", author]),
    ["citation_publication_date", publication.date || publication.year],
    ["citation_journal_title", publication.venue],
    ["citation_volume", publication.volume],
    ["citation_issue", publication.issue],
    ["citation_firstpage", first],
    ["citation_lastpage", last],
    ["citation_doi", publication.doi],
    ["citation_online_date", publication.date],
    ["citation_abstract_html_url", publication.page_url],
  ].filter(([, value]) => value);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(publication.abstract || publication.title)}">
${citationMeta.map(([name, value]) => `  <meta name="${name}" content="${escapeHtml(value)}">`).join("\n")}
  <link rel="canonical" href="${escapeHtml(publication.page_url)}">
  <link rel="stylesheet" href="../../styles.css">
</head>
<body>
  <main class="site-shell publication-page">
    <nav class="topbar" aria-label="Main navigation">
      <a class="wordmark" href="../../">Julian Teusch</a>
      <div class="nav-links">
        <a href="../../#about">About</a>
        <a href="../../#bio">Bio</a>
        <a href="../../#publications">Publications</a>
        <a href="../../#contact">Contact</a>
      </div>
    </nav>
    <article class="paper-detail">
      <p class="eyebrow">${publication.year}</p>
      <h1>${escapeHtml(publication.title)}</h1>
      <p class="paper-authors">${publication.authors.map((author) => author === "Julian Teusch" ? `<strong>${escapeHtml(author)}</strong>` : escapeHtml(author)).join(", ")}</p>
      <p class="publication-meta">${escapeHtml([publication.venue, publication.volume && `Vol. ${publication.volume}`, publication.pages && `pp. ${publication.pages}`].filter(Boolean).join(", "))}</p>
      ${publication.abstract ? `<section class="paper-abstract"><h2>Abstract</h2><p>${escapeHtml(publication.abstract)}</p></section>` : ""}
      <p class="paper-links">
        <a href="${escapeHtml(publication.url)}">DOI</a>
        <span aria-hidden="true"> · </span>
        <a href="../../#publications">All publications</a>
      </p>
    </article>
  </main>
</body>
</html>
`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeXml(value) {
  return escapeHtml(value);
}
