const slidePlayer = document.querySelector("[data-slide-player]");

if (slidePlayer) {
  const decks = {
    extended: {
      totalSlides: 42,
      slideDirectory: "../../assets/projects/sparc/slides",
      slidePrefix: "sparc-slide",
      labelKey: "sparc.deck.extended",
      labelFallback: "Extended deck",
      animationSlides: new Map([
        [13, "slide13_diagonal_vs_structured_tubes"],
        [17, "slide17_hybrid_temporal_inflation"],
        [18, "slide18_split_conformal_flow"],
        [26, "slide28_efficient_vs_wide_calibration"],
        [28, "slide30_low_high_kappa_intervals"],
      ]),
    },
    spotlight: {
      totalSlides: 11,
      slideDirectory: "../../assets/projects/sparc/spotlight/slides",
      slidePrefix: "sparc-spotlight",
      labelKey: "sparc.deck.spotlight",
      labelFallback: "5-minute spotlight",
      animationSlides: new Map(),
    },
  };

  const slideImage = slidePlayer.querySelector("[data-slide-image]");
  const slideAnimation = slidePlayer.querySelector("[data-slide-animation]");
  const slideStage = slidePlayer.querySelector("[data-slide-stage]");
  const liveIndicator = slidePlayer.querySelector("[data-live-indicator]");
  const counter = slidePlayer.querySelector("[data-slide-counter]");
  const range = slidePlayer.querySelector("[data-slide-range]");
  const rangeLabel = slidePlayer.querySelector("[data-slide-range-label]");
  const previous = slidePlayer.querySelector("[data-slide-previous]");
  const next = slidePlayer.querySelector("[data-slide-next]");
  const fullscreen = slidePlayer.querySelector("[data-slide-fullscreen]");
  const animationToggle = slidePlayer.querySelector("[data-animation-toggle]");
  const deckButtons = document.querySelectorAll("[data-deck-button]");
  const animationDirectory = "../../assets/projects/sparc/animations";
  let activeDeck = getInitialDeck();
  let currentSlide = getInitialSlide();
  let animationIsLive = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function getInitialDeck() {
    const requestedDeck = new URLSearchParams(window.location.search).get("deck");
    return requestedDeck && Object.hasOwn(decks, requestedDeck) ? requestedDeck : "extended";
  }

  function getInitialSlide() {
    const requestedSlide = Number(new URLSearchParams(window.location.search).get("slide"));
    const totalSlides = decks[activeDeck].totalSlides;
    return Number.isInteger(requestedSlide) && requestedSlide >= 1 && requestedSlide <= totalSlides
      ? requestedSlide
      : 1;
  }

  function translate(key, fallback, values) {
    const translated = window.siteLanguage?.translate?.(key, values);
    return translated && translated !== key ? translated : fallback;
  }

  function getDeckLabel(deck) {
    return translate(deck.labelKey, deck.labelFallback);
  }

  function getSlideSource(deck, slide) {
    const paddedSlide = String(slide).padStart(2, "0");
    return `${deck.slideDirectory}/${deck.slidePrefix}-${paddedSlide}.png`;
  }

  function renderSlide({ updateUrl = false } = {}) {
    const deck = decks[activeDeck];
    const totalSlides = deck.totalSlides;
    const deckLabel = getDeckLabel(deck);
    const animationName = deck.animationSlides.get(currentSlide);
    const counterText = translate(
      "sparc.deck.counter",
      `Slide ${currentSlide} of ${totalSlides}`,
      { value: currentSlide, total: totalSlides },
    );

    slideImage.src = getSlideSource(deck, currentSlide);
    slideImage.alt = translate(
      "sparc.deck.imageAlt",
      `SPARC ${deckLabel} slide ${currentSlide}`,
      { deck: deckLabel, value: currentSlide },
    );
    range.max = String(totalSlides);
    range.value = String(currentSlide);
    rangeLabel.textContent = counterText;
    counter.textContent = `${currentSlide} / ${totalSlides}`;
    previous.disabled = currentSlide === 1;
    next.disabled = currentSlide === totalSlides;

    deckButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.deckButton === activeDeck));
    });

    if (animationName) {
      const extension = animationIsLive ? "gif" : "png";
      slideAnimation.src = `${animationDirectory}/${animationName}.${extension}`;
      slideAnimation.hidden = false;
      liveIndicator.hidden = !animationIsLive;
      animationToggle.hidden = false;
      animationToggle.textContent = animationIsLive
        ? translate("sparc.deck.still", "Still image")
        : translate("sparc.deck.live", "Live animation");
    } else {
      slideAnimation.hidden = true;
      liveIndicator.hidden = true;
      animationToggle.hidden = true;
      slideAnimation.removeAttribute("src");
    }

    slideStage.setAttribute("aria-label", counterText);

    if (updateUrl) {
      const url = new URL(window.location.href);
      if (activeDeck === "extended") url.searchParams.delete("deck");
      else url.searchParams.set("deck", activeDeck);
      if (currentSlide === 1) url.searchParams.delete("slide");
      else url.searchParams.set("slide", String(currentSlide));
      window.history.replaceState({}, "", url);
    }

    preloadSlide(currentSlide - 1);
    preloadSlide(currentSlide + 1);
  }

  function preloadSlide(slide) {
    const deck = decks[activeDeck];
    if (slide < 1 || slide > deck.totalSlides) return;
    const image = new Image();
    image.src = getSlideSource(deck, slide);
  }

  function showSlide(slide) {
    currentSlide = Math.max(1, Math.min(decks[activeDeck].totalSlides, slide));
    renderSlide({ updateUrl: true });
  }

  function showDeck(deckName) {
    if (!Object.hasOwn(decks, deckName) || deckName === activeDeck) return;
    activeDeck = deckName;
    currentSlide = 1;
    renderSlide({ updateUrl: true });
  }

  previous.addEventListener("click", () => showSlide(currentSlide - 1));
  next.addEventListener("click", () => showSlide(currentSlide + 1));
  range.addEventListener("input", () => showSlide(Number(range.value)));
  slideStage.addEventListener("click", () => showSlide(currentSlide + 1));
  deckButtons.forEach((button) => {
    button.addEventListener("click", () => showDeck(button.dataset.deckButton));
  });
  animationToggle.addEventListener("click", () => {
    animationIsLive = !animationIsLive;
    renderSlide();
  });
  fullscreen.addEventListener("click", async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await slidePlayer.requestFullscreen();
  });

  document.addEventListener("keydown", (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement) return;
    if (event.key === "ArrowLeft") showSlide(currentSlide - 1);
    if (event.key === "ArrowRight") showSlide(currentSlide + 1);
  });
  document.addEventListener("site-language-change", () => renderSlide());

  renderSlide();
}
