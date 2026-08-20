const slidePlayer = document.querySelector("[data-slide-player]");

if (slidePlayer) {
  const totalSlides = 42;
  const slideImage = slidePlayer.querySelector("[data-slide-image]");
  const slideAnimation = slidePlayer.querySelector("[data-slide-animation]");
  const slideStage = slidePlayer.querySelector("[data-slide-stage]");
  const liveIndicator = slidePlayer.querySelector("[data-live-indicator]");
  const counter = slidePlayer.querySelector("[data-slide-counter]");
  const range = slidePlayer.querySelector("[data-slide-range]");
  const previous = slidePlayer.querySelector("[data-slide-previous]");
  const next = slidePlayer.querySelector("[data-slide-next]");
  const fullscreen = slidePlayer.querySelector("[data-slide-fullscreen]");
  const animationToggle = slidePlayer.querySelector("[data-animation-toggle]");
  const animationDirectory = "../../assets/projects/sparc/animations";
  const slideDirectory = "../../assets/projects/sparc/slides";
  const animationSlides = new Map([
    [13, "slide13_diagonal_vs_structured_tubes"],
    [17, "slide17_hybrid_temporal_inflation"],
    [18, "slide18_split_conformal_flow"],
    [26, "slide28_efficient_vs_wide_calibration"],
    [28, "slide30_low_high_kappa_intervals"],
  ]);
  let currentSlide = getInitialSlide();
  let animationIsLive = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function getInitialSlide() {
    const requestedSlide = Number(new URLSearchParams(window.location.search).get("slide"));
    return Number.isInteger(requestedSlide) && requestedSlide >= 1 && requestedSlide <= totalSlides
      ? requestedSlide
      : 1;
  }

  function translate(key, fallback, values) {
    const translated = window.siteLanguage?.translate?.(key, values);
    return translated && translated !== key ? translated : fallback;
  }

  function renderSlide({ updateUrl = false } = {}) {
    const paddedSlide = String(currentSlide).padStart(2, "0");
    const animationName = animationSlides.get(currentSlide);
    slideImage.src = `${slideDirectory}/sparc-slide-${paddedSlide}.png`;
    slideImage.alt = `SPARC presentation slide ${currentSlide}`;
    range.value = String(currentSlide);
    counter.textContent = `${currentSlide} / ${totalSlides}`;
    previous.disabled = currentSlide === 1;
    next.disabled = currentSlide === totalSlides;

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

    slideStage.setAttribute(
      "aria-label",
      translate("sparc.deck.counter", `Slide ${currentSlide} of ${totalSlides}`, { value: currentSlide }),
    );

    if (updateUrl) {
      const url = new URL(window.location.href);
      if (currentSlide === 1) url.searchParams.delete("slide");
      else url.searchParams.set("slide", String(currentSlide));
      window.history.replaceState({}, "", url);
    }

    preloadSlide(currentSlide - 1);
    preloadSlide(currentSlide + 1);
  }

  function preloadSlide(slide) {
    if (slide < 1 || slide > totalSlides) return;
    const image = new Image();
    image.src = `${slideDirectory}/sparc-slide-${String(slide).padStart(2, "0")}.png`;
  }

  function showSlide(slide) {
    currentSlide = Math.max(1, Math.min(totalSlides, slide));
    renderSlide({ updateUrl: true });
  }

  previous.addEventListener("click", () => showSlide(currentSlide - 1));
  next.addEventListener("click", () => showSlide(currentSlide + 1));
  range.addEventListener("input", () => showSlide(Number(range.value)));
  slideStage.addEventListener("click", () => showSlide(currentSlide + 1));
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
