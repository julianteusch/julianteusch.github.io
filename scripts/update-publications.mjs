import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const ORCID = process.env.PUBLICATIONS_ORCID || "0000-0002-4103-8430";
const OUTPUT = process.env.PUBLICATIONS_OUTPUT || "data/publications.json";
const SITE_URL = (process.env.PUBLICATIONS_SITE_URL || "https://julianteusch.github.io").replace(/\/$/, "");
const OPENALEX_URL = new URL("https://api.openalex.org/works");
const OPENALEX_PAGE_SIZE = 100;
const OPENALEX_MAX_ATTEMPTS = 3;
const OPENALEX_RETRY_DELAY_MS = 1_000;
const STATIC_PAGE_URLS = [
  `${SITE_URL}/projects/sparc/`,
  `${SITE_URL}/projects/clipper/`,
  `${SITE_URL}/projects/geofenced-mobility-facilities/`,
];
const PROJECT_PAGE_URLS = new Map([
  ["10.1016/j.tre.2024.103872", `${SITE_URL}/projects/geofenced-mobility-facilities/`],
  ["10.48550/arxiv.2608.20802", `${SITE_URL}/projects/sparc/`],
  ["10.48550/arxiv.2608.26819", `${SITE_URL}/projects/clipper/`],
]);
const CURATED_PUBLICATIONS = [
  {
    title: "Unlocking Capacity: The Role of Online Platforms in Optimizing Capacity Utilization of Access-based Services",
    year: 2025,
    date: "2025-02-16",
    authors: [
      "Jan N. Gremmel",
      "Julian Teusch",
      "Christian Koetsier",
      "David M. Woisetschläger",
      "Jörg P. Müller",
      "Monika Sester",
    ],
    venue: "2025 American Marketing Association Winter Academic Conference",
    url: "https://zdin.digital/zukunftslabore/mobilitaet",
    abstract: "This conference paper examines how membership in third-party online platforms shapes capacity utilization among access-based micromobility service providers, accounting for platform benefits, pricing and distribution decisions, and market conditions.",
    type: "Conference Paper",
  },
];
const CURATED_PREPRINTS = [
  {
    title: "SPARC: Single-Pass Scaling for Motion Forecasting with Conformal Bayesian Last Layers",
    year: 2026,
    date: "2026-08-21",
    authors: ["Sakif Hossain", "Julian Teusch", "Jörg P. Müller"],
    venue: "arXiv",
    doi: "10.48550/arxiv.2608.20802",
    url: "https://arxiv.org/abs/2608.20802",
    abstract: "Human motion forecasters are increasingly accurate and fast, but reliable deployment requires uncertainty estimates that are structured, calibrated, and efficient. SPARC introduces a Bayesian-conformal uncertainty layer for motion forecasting: a deterministic backbone predicts the future mean, while a conjugate Bayesian last layer converts feature leverage into an analytic horizon-wise epistemic scale. This scale augments structured trajectory covariance without Monte Carlo sampling, and split conformal calibration produces prediction tubes with finite-sample validity under exchangeability.",
  },
  {
    title: "CLIPPER: Replayable Shortlisted Optimization for Repeated Spatial Coverage Planning",
    year: 2026,
    date: "2026-08-27",
    authors: ["Julian Teusch", "Jörg Philipp Müller", "Monika Sester"],
    venue: "arXiv",
    doi: "10.48550/arxiv.2608.26819",
    url: "https://arxiv.org/abs/2608.26819",
    abstract: "Operational requirements developed with the City of Braunschweig frame municipal micromobility planning under geofenced exclusions, mandatory retained sites, spacing rules, and area-level caps. CLIPPER forms bounded candidate pools while recomputing exact current gains and checking every active constraint before selection. Across Braunschweig, Munich, and Berlin, it enables rapid, replayable comparison of recorded city-scale planning states while enforcing every encoded model constraint.",
  },
];

OPENALEX_URL.searchParams.set("filter", `author.orcid:${ORCID}`);
OPENALEX_URL.searchParams.set("sort", "publication_year:desc,publication_date:desc");
OPENALEX_URL.searchParams.set("per-page", String(OPENALEX_PAGE_SIZE));
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

const payload = await fetchOpenAlex();
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
  ["arxiv (cornell university)", "arXiv"],
  ["arxiv.org", "arXiv"],
]);
const authorOverrides = new Map([
  ["David M. Woisetschlaeger", "David M. Woisetschläger"],
]);
const supersededPreprintDois = new Set([
  "10.2139/ssrn.4745247",
]);
const preferredPreprintDois = new Map([
  [
    "regulating the curb with geofenced parking evidence on the friction reliability trade off in shared e scooters",
    "10.2139/ssrn.6435376",
  ],
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
    .map((name) => authorOverrides.get(name) || name)
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

const works = payload.results || [];
const publications = mergeWorks(
  works
    .filter((work) => !work.is_retracted)
    .filter((work) => work.primary_location?.is_published === true)
    .filter((work) => cleanDoi(work.doi))
    .map((work) => normalizeWork(work, "publications"))
    .filter((work) => {
      const key = work.doi || titleKey(work.title);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }),
  CURATED_PUBLICATIONS.map((work) => normalizeCuratedWork(work, "publications")),
)
  .sort((a, b) => {
    const byDate = String(b.date || "").localeCompare(String(a.date || ""));
    if (byDate) return byDate;
    return String(a.title).localeCompare(String(b.title));
  });

const preprintSeen = new Set();
const preprints = mergeWorks(
  works
    .filter((work) => !work.is_retracted)
    .filter((work) => work.primary_location?.is_published !== true)
    .filter((work) => isSupportedPreprint(work))
    .sort(comparePreprintRecords)
    .map((work) => normalizeWork(work, "preprints"))
    .filter((work) => !supersededPreprintDois.has(work.doi))
    .filter((work) => {
      const key = titleKey(work.title);
      if (preprintSeen.has(key)) return false;
      preprintSeen.add(key);
      return true;
    }),
  CURATED_PREPRINTS.map((work) => normalizeCuratedWork(work, "preprints")),
)
  .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

function mergeWorks(primary, curated) {
  const merged = [...primary];
  for (const work of curated) {
    if (!workMatches(work, merged)) merged.push(work);
  }
  return merged;
}

function isSupportedPreprint(work) {
  const source = work.primary_location?.source?.display_name?.toLowerCase() || "";
  if (source === "ssrn electronic journal") return Boolean(cleanDoi(work.doi));
  return source === "arxiv.org" || source === "arxiv (cornell university)";
}

function comparePreprintRecords(a, b) {
  const aDoi = cleanDoi(a.doi);
  const bDoi = cleanDoi(b.doi);
  const preferredDoi = preferredPreprintDois.get(titleKey(a.title));
  const byPreferredDoi = Number(bDoi === preferredDoi) - Number(aDoi === preferredDoi);
  if (byPreferredDoi) return byPreferredDoi;

  const byDate = String(b.publication_date || "").localeCompare(String(a.publication_date || ""));
  if (byDate) return byDate;

  return String(bDoi || "").localeCompare(String(aDoi || ""));
}

function workMatches(item, candidates) {
  return candidates.some(
    (candidate) => (item.doi && candidate.doi === item.doi) || titleKey(candidate.title) === titleKey(item.title),
  );
}

function assertNoUnexpectedRemovals(existing, currentPublications, currentPreprints) {
  if (!existing || process.env.PUBLICATIONS_ALLOW_REMOVALS === "1") return;

  const missingPublications = (existing.publications || [])
    .filter((item) => !workMatches(item, currentPublications));
  const missingPreprints = (existing.preprints || [])
    .filter((item) => !workMatches(item, currentPreprints) && !workMatches(item, currentPublications));

  if (missingPublications.length || missingPreprints.length) {
    const missingTitles = [...missingPublications, ...missingPreprints]
      .map((item) => item.title)
      .join("; ");
    throw new Error(
      `OpenAlex response is missing existing work(s): ${missingTitles}. ` +
      "Set PUBLICATIONS_ALLOW_REMOVALS=1 only for an intentional removal.",
    );
  }
}

async function fetchOpenAlex() {
  const works = [];
  let cursor = "*";

  while (cursor) {
    const url = new URL(OPENALEX_URL);
    url.searchParams.set("cursor", cursor);
    const payload = await fetchOpenAlexPage(url);
    works.push(...payload.results);
    cursor = payload.meta?.next_cursor || null;
  }

  if (works.length === 0) {
    throw new Error("OpenAlex response did not contain any works");
  }

  return { results: works };
}

async function fetchOpenAlexPage(url) {
  let lastError;

  for (let attempt = 1; attempt <= OPENALEX_MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "julianteusch.github.io publication updater (mailto:julian.teusch@tu-clausthal.de)",
        },
        signal: AbortSignal.timeout(20_000),
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`.trim());
      }

      const payload = await response.json();
      if (!Array.isArray(payload.results)) {
        throw new Error("response did not contain a works array");
      }

      return payload;
    } catch (error) {
      lastError = error;
      if (attempt < OPENALEX_MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, OPENALEX_RETRY_DELAY_MS * attempt));
      }
    }
  }

  throw new Error(`OpenAlex request failed after ${OPENALEX_MAX_ATTEMPTS} attempts: ${lastError.message}`);
}

let existingData = null;

try {
  existingData = JSON.parse(await readFile(OUTPUT, "utf8"));
} catch {
  // No existing data file yet.
}

assertNoUnexpectedRemovals(existingData, publications, preprints);

let updatedAt = new Date().toISOString();
if (
  existingData &&
  JSON.stringify(existingData.publications || []) === JSON.stringify(publications) &&
  JSON.stringify(existingData.preprints || []) === JSON.stringify(preprints)
) {
  updatedAt = existingData.updated_at || updatedAt;
}

const data = {
  source: "OpenAlex and curated records",
  source_url: `https://openalex.org/authors/orcid:${ORCID}`,
  orcid: ORCID,
  updated_at: updatedAt,
  publications,
  preprints,
};

await mkdir(path.dirname(OUTPUT), { recursive: true });
await writeFile(`${OUTPUT}.tmp`, `${JSON.stringify(data, null, 2)}\n`, "utf8");
await rename(`${OUTPUT}.tmp`, OUTPUT);
await writePublicationPages(publications, "publications");
await writePublicationPages(preprints, "preprints");
await writeSitemap([...publications, ...preprints]);
await writeRobots();

console.log(`Wrote ${publications.length} published works and ${preprints.length} preprints to ${OUTPUT}`);

function normalizeWork(work, section) {
  const doi = cleanDoi(work.doi);
  const source = work.primary_location?.source || {};
  const venue = formatVenue(source.display_name);
  const slug = slugify(work.title, work.publication_year);
  return {
    title: work.title,
    year: work.publication_year,
    date: work.publication_date,
    slug,
    page_url: `${SITE_URL}/${section}/${slug}/`,
    authors: formatAuthors(work.authorships),
    venue,
    doi,
    url: venue === "arXiv"
      ? work.primary_location?.landing_page_url || doiUrl(doi) || work.id
      : doiUrl(doi) || work.primary_location?.landing_page_url || work.id,
    volume: work.biblio?.volume || "",
    issue: work.biblio?.issue || "",
    pages: formatPages(work.biblio),
    citations: work.cited_by_count ?? 0,
    abstract: formatAbstract(work.abstract_inverted_index),
    type: section === "preprints" ? "Preprint" : "Publication",
  };
}

function normalizeCuratedWork(work, section) {
  const doi = cleanDoi(work.doi);
  const slug = slugify(work.title, work.year);
  return {
    title: work.title,
    year: work.year,
    date: work.date,
    slug,
    page_url: `${SITE_URL}/${section}/${slug}/`,
    authors: work.authors || [],
    venue: work.venue || "",
    doi,
    url: work.url || doiUrl(doi) || "",
    volume: work.volume || "",
    issue: work.issue || "",
    pages: work.pages || "",
    citations: work.citations ?? 0,
    abstract: work.abstract || "",
    type: section === "preprints" ? "Preprint" : (work.type || "Publication"),
  };
}

async function writePublicationPages(items, section) {
  await rm(section, { recursive: true, force: true });
  for (const publication of items) {
    const dir = path.join(section, publication.slug);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "index.html"), renderPublicationPage(publication), "utf8");
  }
}

async function writeSitemap(items) {
  const urls = [
    `${SITE_URL}/`,
    ...STATIC_PAGE_URLS,
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
  const section = publication.type === "Preprint"
    ? { anchor: "preprints", label: "All preprints", translationKey: "paper.allPreprints" }
    : { anchor: "publications", label: "All publications", translationKey: "paper.allPublications" };
  const abstract = publication.abstract || "The abstract is available on the linked record.";
  const abstractTranslation = publication.abstract ? "" : ' data-i18n="paper.abstractFallback"';
  const projectPageUrl = PROJECT_PAGE_URLS.get(publication.doi?.toLowerCase());
  const publicationMetadata = [
    publication.venue && escapeHtml(publication.venue),
    publication.volume && `<span data-i18n="publication.volume" data-i18n-value="${escapeHtml(publication.volume)}">Vol. ${escapeHtml(publication.volume)}</span>`,
    publication.pages && `<span data-i18n="publication.pages" data-i18n-value="${escapeHtml(publication.pages)}">pp. ${escapeHtml(publication.pages)}</span>`,
  ].filter(Boolean).join(", ");
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
  const externalRecordLabel = publication.venue === "arXiv"
    ? "arXiv"
    : publication.doi ? "DOI" : "External record";
  const paperLinks = [
    publication.url && `<a href="${escapeHtml(publication.url)}"${externalRecordLabel === "External record" ? ' data-i18n="paper.externalRecord"' : ""}>${externalRecordLabel}</a>`,
    projectPageUrl && `<a href="${escapeHtml(projectPageUrl)}" data-i18n="paper.projectPage">Project page</a>`,
    `<a href="../../#${section.anchor}" data-i18n="${section.translationKey}">${section.label}</a>`,
  ].filter(Boolean).join('\n        <span aria-hidden="true"> · </span>\n        ');

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
    <nav class="topbar" aria-label="Main navigation" data-i18n-aria-label="nav.label">
      <a class="wordmark" href="../../">Julian Teusch</a>
      <div class="topbar-actions">
        <div class="nav-links">
          <a href="../../#about" data-i18n="nav.about">About</a>
          <a href="../../#bio" data-i18n="nav.bio">Bio</a>
          <a href="../../#projects" data-i18n="nav.projects">Projects</a>
          <a href="../../#publications" data-i18n="nav.publications">Publications</a>
          <a href="../../#preprints" data-i18n="nav.preprints">Preprints</a>
          <a href="../../#contact" data-i18n="nav.contact">Contact</a>
        </div>
        <div class="language-switch" role="group" aria-label="Language selection" data-i18n-aria-label="language.switch">
          <button class="language-button" type="button" data-lang-toggle="de" aria-pressed="false">DE</button>
          <button class="language-button" type="button" data-lang-toggle="en" aria-pressed="true">EN</button>
        </div>
      </div>
    </nav>
    <article class="paper-detail">
      <p class="eyebrow">${publication.year}</p>
      <h1>${escapeHtml(publication.title)}</h1>
      <p class="paper-authors">${publication.authors.map((author) => author === "Julian Teusch" ? `<strong>${escapeHtml(author)}</strong>` : escapeHtml(author)).join(", ")}</p>
      <p class="publication-meta">${publicationMetadata}</p>
      <section class="paper-abstract"><h2 data-i18n="paper.abstract">Abstract</h2><p${abstractTranslation}>${escapeHtml(abstract)}</p></section>
      <p class="paper-links">
        ${paperLinks}
      </p>
    </article>
  </main>
  <script src="../../assets/language.js"></script>
  <!-- Cloudflare Web Analytics --><script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"f2b294e5d1904898a65f5b61f3ee6893"}'></script><!-- End Cloudflare Web Analytics -->
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
