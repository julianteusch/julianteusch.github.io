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
    "nav.projects": "Projects",
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
    "projects.kicker": "Projects",
    "projects.heading": "Projects",
    "projects.sparc.summary": "Single-pass, structured and calibrated uncertainty for human motion forecasting. Accepted at ECCV 2026.",
    "projects.sparc.open": "Explore project",
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
    "sparc.documentDescription": "SPARC adds structured, calibrated uncertainty to human motion forecasting in a single forward pass.",
    "sparc.nav.home": "Julian Teusch",
    "sparc.nav.label": "Project navigation",
    "sparc.nav.overview": "Overview",
    "sparc.nav.method": "Method",
    "sparc.nav.slides": "Slides",
    "sparc.nav.resources": "Resources",
    "sparc.venue": "ECCV 2026 Spotlight · Malmö, Sweden",
    "sparc.subtitle": "Single-Pass Scaling for Motion Forecasting with Conformal Bayesian Last Layers",
    "sparc.authors.note": "* Equal contribution",
    "sparc.hero.summary": "A fast deterministic motion forecaster becomes a structured, calibrated predictive density without Monte Carlo sampling or an ensemble loop.",
    "sparc.action.paper": "Paper PDF",
    "sparc.action.slides": "Extended slides",
    "sparc.action.supplement": "Supplement",
    "sparc.overview.eyebrow": "The problem",
    "sparc.overview.heading": "Point forecasts do not say when they should be trusted.",
    "sparc.overview.body": "Human motion forecasting is a core component for planning around people. SPARC retains the speed of a deterministic backbone while adding an analytic epistemic signal, structured graph-temporal covariance and post-hoc split conformal calibration.",
    "sparc.metric.nll": "NLL mean rank",
    "sparc.metric.tradeoff": "MPJPE + NLL mean rank",
    "sparc.metric.risk": "MPJPE in the highest-κ decile",
    "sparc.metric.pass": "forward pass at inference",
    "sparc.method.eyebrow": "Method",
    "sparc.method.heading": "Structured uncertainty, calibrated in one pass.",
    "sparc.method.leverage.title": "Bayesian leverage",
    "sparc.method.leverage.body": "A conjugate Bayesian last layer yields κₜ(x), an analytic measure of how strongly a test input is supported by the learned feature representation.",
    "sparc.method.structure.title": "Preserved structure",
    "sparc.method.structure.body": "κₜ scales a graph-temporal covariance. Uncertainty expands where support is weak while correlations across joints and future steps remain intact.",
    "sparc.method.calibration.title": "Conformal calibration",
    "sparc.method.calibration.body": "Held-out residual quantiles turn predictive scales into 95% marginal tubes with finite-sample validity under exchangeability.",
    "sparc.animation.eyebrow": "Animated explanations",
    "sparc.animation.heading": "Watch uncertainty take shape.",
    "sparc.animation.body": "The technical deck contains five animated figures. They remain live here, including covariance scaling, calibration and low-versus-high κ examples.",
    "sparc.animation.structure": "Scale epistemics while preserving trajectory structure.",
    "sparc.animation.hybrid": "Inflate temporal covariance where epistemic leverage is high.",
    "sparc.animation.conformal": "Convert held-out residuals into calibrated 95% tubes.",
    "sparc.animation.efficiency": "Target coverage without needlessly wide intervals.",
    "sparc.animation.kappa": "Higher κ produces visibly wider calibrated intervals.",
    "sparc.deck.eyebrow": "Technical presentation",
    "sparc.deck.heading": "Explore the full 42-slide deck.",
    "sparc.deck.body": "Use the controls, arrow keys or the slider. Animated figures play directly inside the corresponding slides; the downloadable PDF preserves the complete technical narrative.",
    "sparc.deck.previous": "Previous slide",
    "sparc.deck.next": "Next slide",
    "sparc.deck.fullscreen": "Fullscreen",
    "sparc.deck.live": "Live animation",
    "sparc.deck.still": "Still image",
    "sparc.deck.counter": "Slide {value} of 42",
    "sparc.poster.eyebrow": "ECCV 2026",
    "sparc.poster.heading": "The project at a glance.",
    "sparc.poster.body": "The conference poster condenses the motivation, six-stage pipeline, main benchmark results and deployment scope into a single visual overview.",
    "sparc.poster.open": "Open the conference poster as a PDF",
    "sparc.resources.eyebrow": "Resources",
    "sparc.resources.heading": "Paper, poster and presentations.",
    "sparc.resources.paper": "Accepted manuscript",
    "sparc.resources.paperDetail": "Main paper · 18 pages",
    "sparc.resources.supplement": "Supplementary material",
    "sparc.resources.supplementDetail": "Extended methods and results",
    "sparc.resources.poster": "Conference poster",
    "sparc.resources.posterDetail": "ECCV 2026 · 1400 × 1000 mm",
    "sparc.resources.deck": "Extended technical deck",
    "sparc.resources.deckDetail": "42 slides · full technical deck",
    "sparc.resources.spotlight": "ECCV spotlight deck",
    "sparc.resources.spotlightDetail": "5-minute talk · 12 slides",
    "sparc.citation.eyebrow": "Citation",
    "sparc.citation.heading": "Accepted at ECCV 2026.",
    "sparc.citation.text": "Sakif Hossain*, Julian Teusch*, and Jörg P. Müller. SPARC: Single-Pass Scaling for Motion Forecasting with Conformal Bayesian Last Layers. European Conference on Computer Vision (ECCV), 2026. *Equal contribution.",
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
    "nav.projects": "Projekte",
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
    "projects.kicker": "Projekte",
    "projects.heading": "Projekte",
    "projects.sparc.summary": "Single-Pass, strukturierte und kalibrierte Unsicherheit für die Vorhersage menschlicher Bewegungen. Angenommen bei der ECCV 2026.",
    "projects.sparc.open": "Projekt ansehen",
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
    "sparc.documentDescription": "SPARC ergänzt die Vorhersage menschlicher Bewegungen in einem einzigen Forward Pass um strukturierte, kalibrierte Unsicherheit.",
    "sparc.nav.home": "Julian Teusch",
    "sparc.nav.label": "Projektnavigation",
    "sparc.nav.overview": "Überblick",
    "sparc.nav.method": "Methode",
    "sparc.nav.slides": "Folien",
    "sparc.nav.resources": "Materialien",
    "sparc.venue": "ECCV 2026 Spotlight · Malmö, Schweden",
    "sparc.subtitle": "Single-Pass Scaling for Motion Forecasting with Conformal Bayesian Last Layers",
    "sparc.authors.note": "* Gleicher Beitrag",
    "sparc.hero.summary": "Aus einem schnellen deterministischen Bewegungsmodell wird eine strukturierte, kalibrierte prädiktive Dichte, ohne Monte-Carlo-Sampling oder Ensemble-Schleife.",
    "sparc.action.paper": "Paper als PDF",
    "sparc.action.slides": "Ausführliche Folien",
    "sparc.action.supplement": "Supplement",
    "sparc.overview.eyebrow": "Das Problem",
    "sparc.overview.heading": "Punktvorhersagen zeigen nicht, wann man ihnen vertrauen sollte.",
    "sparc.overview.body": "Die Vorhersage menschlicher Bewegungen ist ein zentraler Baustein für Planung in der Nähe von Menschen. SPARC behält die Geschwindigkeit eines deterministischen Backbones bei und ergänzt ein analytisches epistemisches Signal, strukturierte graph-zeitliche Kovarianz und nachgelagerte Split-Conformal-Kalibrierung.",
    "sparc.metric.nll": "Mittlerer NLL-Rang",
    "sparc.metric.tradeoff": "Mittlerer MPJPE- und NLL-Rang",
    "sparc.metric.risk": "MPJPE im höchsten κ-Dezil",
    "sparc.metric.pass": "Forward Pass bei der Inferenz",
    "sparc.method.eyebrow": "Methode",
    "sparc.method.heading": "Strukturierte Unsicherheit, kalibriert in einem Durchlauf.",
    "sparc.method.leverage.title": "Bayesscher Leverage",
    "sparc.method.leverage.body": "Eine konjugierte Bayessche letzte Schicht liefert κₜ(x), ein analytisches Maß dafür, wie stark eine Testeingabe durch die erlernte Merkmalsrepräsentation gestützt wird.",
    "sparc.method.structure.title": "Erhaltene Struktur",
    "sparc.method.structure.body": "κₜ skaliert eine graph-zeitliche Kovarianz. Bei schwacher Unterstützung wächst die Unsicherheit, während Korrelationen zwischen Gelenken und zukünftigen Zeitschritten erhalten bleiben.",
    "sparc.method.calibration.title": "Conformal-Kalibrierung",
    "sparc.method.calibration.body": "Quantile zurückgehaltener Residuen überführen prädiktive Skalen in marginale 95-Prozent-Tubes mit endlicher Stichprobengültigkeit unter Austauschbarkeit.",
    "sparc.animation.eyebrow": "Animierte Erklärungen",
    "sparc.animation.heading": "Beobachte, wie Unsicherheit Form annimmt.",
    "sparc.animation.body": "Der technische Foliensatz enthält fünf animierte Abbildungen. Hier bleiben sie aktiv, einschließlich Kovarianzskalierung, Kalibrierung und Beispielen mit niedrigem und hohem κ.",
    "sparc.animation.structure": "Epistemische Unsicherheit skalieren und die Trajektorienstruktur erhalten.",
    "sparc.animation.hybrid": "Zeitliche Kovarianz dort vergrößern, wo der epistemische Leverage hoch ist.",
    "sparc.animation.conformal": "Zurückgehaltene Residuen in kalibrierte 95-Prozent-Tubes überführen.",
    "sparc.animation.efficiency": "Zielabdeckung ohne unnötig breite Intervalle erreichen.",
    "sparc.animation.kappa": "Höheres κ erzeugt sichtbar breitere kalibrierte Intervalle.",
    "sparc.deck.eyebrow": "Technische Präsentation",
    "sparc.deck.heading": "Den vollständigen Foliensatz mit 42 Folien erkunden.",
    "sparc.deck.body": "Nutze die Bedienelemente, Pfeiltasten oder den Regler. Animierte Abbildungen laufen direkt in den zugehörigen Folien; das PDF enthält die vollständige technische Darstellung.",
    "sparc.deck.previous": "Vorherige Folie",
    "sparc.deck.next": "Nächste Folie",
    "sparc.deck.fullscreen": "Vollbild",
    "sparc.deck.live": "Live-Animation",
    "sparc.deck.still": "Standbild",
    "sparc.deck.counter": "Folie {value} von 42",
    "sparc.poster.eyebrow": "ECCV 2026",
    "sparc.poster.heading": "Das Projekt auf einen Blick.",
    "sparc.poster.body": "Das Konferenzposter verdichtet Motivation, sechsstufige Pipeline, zentrale Benchmark-Ergebnisse und Einsatzgrenzen zu einem visuellen Überblick.",
    "sparc.poster.open": "Konferenzposter als PDF öffnen",
    "sparc.resources.eyebrow": "Materialien",
    "sparc.resources.heading": "Paper, Poster und Präsentationen.",
    "sparc.resources.paper": "Angenommenes Manuskript",
    "sparc.resources.paperDetail": "Hauptpaper · 18 Seiten",
    "sparc.resources.supplement": "Ergänzendes Material",
    "sparc.resources.supplementDetail": "Erweiterte Methoden und Ergebnisse",
    "sparc.resources.poster": "Konferenzposter",
    "sparc.resources.posterDetail": "ECCV 2026 · 1400 × 1000 mm",
    "sparc.resources.deck": "Ausführlicher technischer Foliensatz",
    "sparc.resources.deckDetail": "42 Folien · vollständiger technischer Foliensatz",
    "sparc.resources.spotlight": "ECCV-Spotlight-Folien",
    "sparc.resources.spotlightDetail": "5-Minuten-Vortrag · 12 Folien",
    "sparc.citation.eyebrow": "Zitation",
    "sparc.citation.heading": "Angenommen bei der ECCV 2026.",
    "sparc.citation.text": "Sakif Hossain*, Julian Teusch* und Jörg P. Müller. SPARC: Single-Pass Scaling for Motion Forecasting with Conformal Bayesian Last Layers. European Conference on Computer Vision (ECCV), 2026. *Gleicher Beitrag.",
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
