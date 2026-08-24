document.querySelectorAll("[data-route-comparison]").forEach((comparison) => {
  const slider = comparison.querySelector("[data-route-slider]");
  if (!slider) return;

  const update = () => comparison.style.setProperty("--route-split", `${slider.value}%`);
  slider.addEventListener("input", update);
  update();
});
