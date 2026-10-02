let evidenceMode = "common";
function renderEvidenceExample() {
  const common = evidenceMode === "common";
  document.querySelector('[data-plan-score="one"]').textContent = common ? "500 m" : "0 m";
  document.querySelector('[data-plan-score="two"]').textContent = common ? "450 m" : "400 m";
  document.querySelector('[data-plan-bar="one"]').style.width = common ? "50%" : "0%";
  document.querySelector('[data-plan-bar="two"]').style.width = common ? "45%" : "40%";
  const result = document.querySelector("[data-example-result]");
  result.dataset.i18n = common ? "fvr.example.commonResult" : "fvr.example.dependentResult";
  result.textContent = window.siteLanguage.translate(result.dataset.i18n);
  document.querySelectorAll("[data-evidence]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.evidence === evidenceMode));
  });
}
document.querySelectorAll("[data-evidence]").forEach((button) => {
  button.addEventListener("click", () => {
    evidenceMode = button.dataset.evidence;
    renderEvidenceExample();
  });
});
document.addEventListener("site-language-change", renderEvidenceExample);
renderEvidenceExample();
