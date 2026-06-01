async function loadPublications() {
  const list = document.querySelector("[data-publications-list]");
  const meta = document.querySelector("[data-publications-meta]");

  if (!list) return;

  try {
    const response = await fetch("data/publications.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const publications = Array.isArray(data.publications) ? data.publications : [];

    if (publications.length === 0) {
      list.innerHTML = "<li>No published works found.</li>";
      return;
    }

    list.innerHTML = publications.map(renderPublication).join("");

    if (meta && data.updated_at) {
      const date = new Date(data.updated_at);
      meta.textContent = `Automatically updated from ${data.source || "OpenAlex"} on ${date.toLocaleDateString("en-GB")}.`;
    }
  } catch (error) {
    list.innerHTML = "<li>Publications could not be loaded right now.</li>";
    if (meta) meta.textContent = "";
  }
}

function renderPublication(publication) {
  const title = escapeHtml(publication.title || "Untitled");
  const authors = (publication.authors || []).map(formatAuthor).join(", ");
  const venue = escapeHtml(publication.venue || "");
  const year = escapeHtml(String(publication.year || ""));
  const details = [venue, publication.volume && `Vol. ${escapeHtml(publication.volume)}`, publication.pages && `pp. ${escapeHtml(publication.pages)}`]
    .filter(Boolean)
    .join(", ");
  const url = escapeAttribute(publication.url || publication.doi || "#");
  const doi = publication.doi ? `<a href="https://doi.org/${escapeAttribute(publication.doi)}">DOI</a>` : "";

  return `
    <li class="publication-item">
      <h3><a href="${url}">${title}</a></h3>
      <p class="publication-authors">${authors}</p>
      <p class="publication-meta">${details}${details && year ? " · " : ""}${year}${doi ? ` · ${doi}` : ""}</p>
    </li>
  `;
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

loadPublications();
