let publicationData = null;
let publicationsFailedToLoad = false;

async function loadPublications() {
  if (!document.querySelector("[data-publications-list], [data-preprints-list]")) return;

  try {
    const response = await fetch("data/publications.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    publicationData = await response.json();
    publicationsFailedToLoad = false;
  } catch {
    publicationData = null;
    publicationsFailedToLoad = true;
  }

  renderPublications();
}

function renderPublications() {
  const list = document.querySelector("[data-publications-list]");
  const preprintsList = document.querySelector("[data-preprints-list]");
  const meta = document.querySelector("[data-publications-meta]");

  if (publicationsFailedToLoad) {
    if (list) list.innerHTML = `<li>${escapeHtml(localize("publications.error", "Publications could not be loaded right now."))}</li>`;
    if (preprintsList) preprintsList.innerHTML = `<li>${escapeHtml(localize("preprints.error", "Preprints could not be loaded right now."))}</li>`;
    if (meta) meta.textContent = "";
    return;
  }

  if (!publicationData) return;

  const publications = Array.isArray(publicationData.publications) ? publicationData.publications : [];
  const preprints = Array.isArray(publicationData.preprints) ? publicationData.preprints : [];

  if (list) {
    list.innerHTML = publications.length
      ? publications.map(renderPublication).join("")
      : `<li>${escapeHtml(localize("publications.empty", "No published works found."))}</li>`;
  }

  if (preprintsList) {
    preprintsList.innerHTML = preprints.length
      ? preprints.map(renderPublication).join("")
      : `<li>${escapeHtml(localize("preprints.empty", "No preprints found."))}</li>`;
  }

  if (meta && publicationData.updated_at) {
    const date = new Date(publicationData.updated_at);
    const language = window.siteLanguage?.get?.() || "en";
    const dateLabel = date.toLocaleDateString(language === "de" ? "de-DE" : "en-GB");
    meta.textContent = localize(
      "publications.updated",
      `Automatically updated from ${publicationData.source || "OpenAlex"} on ${dateLabel}.`,
      { source: publicationData.source || "OpenAlex", date: dateLabel },
    );
  }
}

function renderPublication(publication) {
  const title = escapeHtml(publication.title || "Untitled");
  const authors = (publication.authors || []).map(formatAuthor).join(", ");
  const venue = escapeHtml(publication.venue || "");
  const year = escapeHtml(String(publication.year || ""));
  const details = [
    venue,
    publication.volume && escapeHtml(localize("publication.volume", `Vol. ${publication.volume}`, { value: publication.volume })),
    publication.pages && escapeHtml(localize("publication.pages", `pp. ${publication.pages}`, { value: publication.pages })),
  ]
    .filter(Boolean)
    .join(", ");
  const url = escapeAttribute(publication.page_url || publication.url || publication.doi || "#");
  const doi = publication.doi ? `<a href="https://doi.org/${escapeAttribute(publication.doi)}">DOI</a>` : "";

  return `
    <li class="publication-item">
      <span class="publication-year">${year}</span>
      <div class="publication-content">
        <h3><a href="${url}">${title}</a></h3>
        <p class="publication-authors">${authors}</p>
        <p class="publication-meta">${details}${doi ? ` · ${doi}` : ""}</p>
      </div>
    </li>
  `;
}

function localize(key, fallback, values) {
  const translation = window.siteLanguage?.translate?.(key, values);
  return translation && translation !== key ? translation : fallback;
}

function formatAuthor(name) {
  const safeName = escapeHtml(name);
  return name === "Julian Teusch" ? `<strong>${safeName}</strong>` : safeName;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

document.addEventListener("site-language-change", renderPublications);
loadPublications();
