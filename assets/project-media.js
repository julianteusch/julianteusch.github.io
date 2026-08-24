document.querySelectorAll("[data-media-switcher]").forEach((switcher) => {
  const image = switcher.querySelector("[data-media-image]");
  const caption = switcher.querySelector("figcaption[data-media-caption]");
  const buttons = [...switcher.querySelectorAll("[data-media-button]")];

  function updateCopy(button) {
    const translate = window.siteLanguage?.translate;
    if (image && button.dataset.mediaAlt) {
      image.alt = translate ? translate(button.dataset.mediaAlt) : button.textContent.trim();
    }
    if (caption && button.dataset.mediaCaption) {
      caption.textContent = translate ? translate(button.dataset.mediaCaption) : "";
    }
  }

  function select(button) {
    buttons.forEach((candidate) => {
      candidate.setAttribute("aria-pressed", String(candidate === button));
    });
    if (image && button.dataset.mediaSrc) image.src = button.dataset.mediaSrc;
    updateCopy(button);
  }

  buttons.forEach((button) => button.addEventListener("click", () => select(button)));
  document.addEventListener("site-language-change", () => {
    const selected = buttons.find((button) => button.getAttribute("aria-pressed") === "true");
    if (selected) updateCopy(selected);
  });

  const initial = buttons.find((button) => button.getAttribute("aria-pressed") === "true") || buttons[0];
  if (initial) select(initial);
});
