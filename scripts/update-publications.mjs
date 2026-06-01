import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const ORCID = process.env.PUBLICATIONS_ORCID || "0000-0002-4103-8430";
const OUTPUT = process.env.PUBLICATIONS_OUTPUT || "data/publications.json";
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

const publications = (payload.results || [])
  .filter((work) => !work.is_retracted)
  .filter((work) => work.primary_location?.is_published === true)
  .filter((work) => cleanDoi(work.doi))
  .map((work) => {
    const doi = cleanDoi(work.doi);
    const source = work.primary_location?.source || {};
    return {
      title: work.title,
      year: work.publication_year,
      date: work.publication_date,
      authors: formatAuthors(work.authorships),
      venue: formatVenue(source.display_name),
      doi,
      url: doiUrl(doi) || work.primary_location?.landing_page_url || work.id,
      volume: work.biblio?.volume || "",
      issue: work.biblio?.issue || "",
      pages: formatPages(work.biblio),
      citations: work.cited_by_count ?? 0,
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

console.log(`Wrote ${publications.length} published works to ${OUTPUT}`);
