const translations = {
  en: {
    "document.description": "Julian Teusch is a researcher at the Institute of Informatics, Clausthal University of Technology.",
    "portrait.alt": "Portrait of Julian Teusch",
    "language.switch": "Language selection",
    "affiliation.role": "Researcher",
    "affiliation.institute": "Institute of Informatics",
    "affiliation.university": "Clausthal University of Technology",
    "profile-links.label": "Profile links",
    "profile.email": "Email",
    "nav.label": "Main navigation",
    "nav.about": "About",
    "nav.bio": "Bio",
    "nav.publications": "Publications",
    "nav.preprints": "Preprints",
    "nav.contact": "Contact",
    "about.kicker": "About",
    "about.heading": "About Me",
    "about.first": "I am a researcher at the Institute of Informatics at Clausthal University of Technology. My work focuses on machine learning, optimization, causal policy evaluation, geospatial analytics, reinforcement learning, and auditability for operational decision support.",
    "about.second": "Shared micromobility, particularly e-scooter systems, provides the empirical setting for much of this work. I study how urban mobility platforms can be predicted, planned, governed, and evaluated when decisions have to respect both operational goals and regulatory constraints.",
    "bio.kicker": "Short Bio",
    "bio.heading": "Short Bio",
    "bio.first": "Since 2021, I have been a research associate at the Institute of Informatics, Clausthal University of Technology. I am pursuing a PhD in computer science under the supervision of Prof. Dr. Jörg P. Müller, with a dissertation on governance-aware decision support for regulated urban mobility systems.",
    "bio.second": "Before that, I studied business information systems at Clausthal University of Technology and transport, logistics, and mobility at Ostfalia University of Applied Sciences. My project work includes data-driven shared and micromobility research, AI education, and digital application systems.",
    "publications.kicker": "Publications",
    "publications.heading": "Publications",
    "publications.loading": "Loading publications...",
    "publications.empty": "No published works found.",
    "publications.error": "Publications could not be loaded right now.",
    "publications.note": "Publication data is loaded automatically from OpenAlex.",
    "publications.updated": "Automatically updated from {source} on {date}.",
    "preprints.kicker": "Preprints",
    "preprints.heading": "Preprints",
    "preprints.loading": "Loading preprints...",
    "preprints.empty": "No preprints found.",
    "preprints.error": "Preprints could not be loaded right now.",
    "contact.label": "Contact information",
    "contact.institute": "Institute of Informatics, Clausthal University of Technology",
    "contact.country": "Germany",
    "publication.volume": "Vol. {value}",
    "publication.pages": "pp. {value}",
    "paper.abstract": "Abstract",
    "paper.abstractFallback": "The abstract is available on the linked record.",
    "paper.allPublications": "All publications",
    "paper.allPreprints": "All preprints",
  },
  de: {
    "document.description": "Julian Teusch ist wissenschaftlicher Mitarbeiter am Institut für Informatik der Technischen Universität Clausthal.",
    "portrait.alt": "Porträt von Julian Teusch",
    "language.switch": "Sprachauswahl",
    "affiliation.role": "Wissenschaftlicher Mitarbeiter",
    "affiliation.institute": "Institut für Informatik",
    "affiliation.university": "Technische Universität Clausthal",
    "profile-links.label": "Profil-Links",
    "profile.email": "E-Mail",
    "nav.label": "Hauptnavigation",
    "nav.about": "Über mich",
    "nav.bio": "Kurzbiografie",
    "nav.publications": "Publikationen",
    "nav.preprints": "Preprints",
    "nav.contact": "Kontakt",
    "about.kicker": "Über mich",
    "about.heading": "Über mich",
    "about.first": "Ich bin wissenschaftlicher Mitarbeiter am Institut für Informatik der Technischen Universität Clausthal. Meine Forschung konzentriert sich auf maschinelles Lernen, Optimierung, kausale Politikevaluation, Geodatenanalyse, Reinforcement Learning und Nachvollziehbarkeit für operative Entscheidungsunterstützung.",
    "about.second": "Geteilte Mikromobilität, insbesondere E-Scooter-Systeme, bildet den empirischen Rahmen eines Großteils dieser Arbeit. Ich untersuche, wie urbane Mobilitätsplattformen prognostiziert, geplant, gesteuert und bewertet werden können, wenn Entscheidungen sowohl betriebliche Ziele als auch regulatorische Vorgaben berücksichtigen müssen.",
    "bio.kicker": "Kurzbiografie",
    "bio.heading": "Kurzbiografie",
    "bio.first": "Seit 2021 bin ich wissenschaftlicher Mitarbeiter am Institut für Informatik der Technischen Universität Clausthal. Unter Betreuung von Prof. Dr. Jörg P. Müller promoviere ich in Informatik mit einer Dissertation über governance-bewusste Entscheidungsunterstützung für regulierte urbane Mobilitätssysteme.",
    "bio.second": "Zuvor habe ich Wirtschaftsinformatik an der Technischen Universität Clausthal sowie Verkehr, Logistik und Mobilität an der Ostfalia Hochschule für angewandte Wissenschaften studiert. Meine Projektarbeit umfasst datengetriebene Forschung zu Shared und Mikromobilität, KI-Bildung und digitale Anwendungssysteme.",
    "publications.kicker": "Publikationen",
    "publications.heading": "Publikationen",
    "publications.loading": "Publikationen werden geladen...",
    "publications.empty": "Keine veröffentlichten Arbeiten gefunden.",
    "publications.error": "Publikationen konnten derzeit nicht geladen werden.",
    "publications.note": "Die Publikationsdaten werden automatisch von OpenAlex geladen.",
    "publications.updated": "Automatisch aktualisiert von {source} am {date}.",
    "preprints.kicker": "Preprints",
    "preprints.heading": "Preprints",
    "preprints.loading": "Preprints werden geladen...",
    "preprints.empty": "Keine Preprints gefunden.",
    "preprints.error": "Preprints konnten derzeit nicht geladen werden.",
    "contact.label": "Kontaktinformationen",
    "contact.institute": "Institut für Informatik, Technische Universität Clausthal",
    "contact.country": "Deutschland",
    "publication.volume": "Bd. {value}",
    "publication.pages": "S. {value}",
    "paper.abstract": "Zusammenfassung",
    "paper.abstractFallback": "Die Zusammenfassung ist im verlinkten Eintrag verfügbar.",
    "paper.allPublications": "Alle Publikationen",
    "paper.allPreprints": "Alle Preprints",
  },
};

const supportedLanguages = Object.keys(translations);
let activeLanguage;

function interpolate(text, values = {}) {
  return text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

function translate(key, values) {
  const dictionary = translations[activeLanguage] || translations.en;
  return interpolate(dictionary[key] || translations.en[key] || key, values);
}

function getInitialLanguage() {
  const queryLanguage = new URLSearchParams(window.location.search).get("lang");
  if (supportedLanguages.includes(queryLanguage)) return queryLanguage;

  try {
    const storedLanguage = window.localStorage.getItem("site-language");
    if (supportedLanguages.includes(storedLanguage)) return storedLanguage;
  } catch {
    // Language persistence is optional.
  }

  return "en";
}

function applyLanguage(language, { persist = true, updateUrl = false } = {}) {
  activeLanguage = supportedLanguages.includes(language) ? language : "en";
  document.documentElement.lang = activeLanguage;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const values = element.dataset.i18nValue ? { value: element.dataset.i18nValue } : undefined;
    element.textContent = translate(element.dataset.i18n, values);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", translate(element.dataset.i18nAriaLabel));
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    element.setAttribute("alt", translate(element.dataset.i18nAlt));
  });
  document.querySelectorAll("[data-i18n-content]").forEach((element) => {
    element.setAttribute("content", translate(element.dataset.i18nContent));
  });
  document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
    const isActive = button.dataset.langToggle === activeLanguage;
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (persist) {
    try {
      window.localStorage.setItem("site-language", activeLanguage);
    } catch {
      // Language persistence is optional.
    }
  }

  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", activeLanguage);
    window.history.replaceState({}, "", url);
  }

  document.dispatchEvent(new CustomEvent("site-language-change", { detail: { language: activeLanguage } }));
}

document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.langToggle, { updateUrl: true }));
});

window.siteLanguage = {
  get: () => activeLanguage,
  translate,
};

applyLanguage(getInitialLanguage());
