// JS/core/ui.js
console.log("UI.JS LOADED");

// ==========================
// VIEW SWITCHING
// ==========================
const views = document.querySelectorAll(".view");

export function showView(id) {
  views.forEach(v => (v.style.display = "none"));
  const el = document.getElementById(id);
  if (el) el.style.display = "block";
}

// ==========================
// HOME MENU BUTTONS
// ==========================
document.getElementById("btnOpenAutoCalc")?.addEventListener("click", () =>
  showView("autoCalcView")
);

document.getElementById("btnOpenMeasures")?.addEventListener("click", () =>
  showView("measuresView")
);

document.getElementById("btnOpenCosts")?.addEventListener("click", () =>
  showView("costsView")
);

document.getElementById("btnOpenPrices")?.addEventListener("click", () =>
  showView("pricesView")
);

document.getElementById("btnOpenArchive")?.addEventListener("click", () =>
  showView("archiveView")
);

document.getElementById("btnOpenTroskovnikUpload")?.addEventListener("click", () =>
  showView("troskovnikUploadView")
);

document.getElementById("btnOpenTroskovnikCalc")?.addEventListener("click", () =>
  showView("troskovnikCalcView")
);

// Gumb za Postavke / Profil
document.getElementById("btnOpenSettings")?.addEventListener("click", () =>
  showView("settingsView")
);

// ==========================
// BACK BUTTONS
// ==========================
document.querySelectorAll(".btn-back").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    if (target) showView(target);
  });
});

// ==========================
// STEPENICE TOGGLE
// ==========================
const chkStep = document.getElementById("chkStepenice");
const stepInputs = document.getElementById("stepeniceInputs");

chkStep?.addEventListener("change", () => {
  if (stepInputs)
    stepInputs.style.display = chkStep.checked ? "block" : "none";
});

// ==========================
// FORMAT POD / ZID TOGGLE
// ==========================
const chkPod = document.getElementById("chkPod");
const formatPodWrap = document.getElementById("formatPodWrap");

chkPod?.addEventListener("change", () => {
  if (formatPodWrap)
    formatPodWrap.style.display = chkPod.checked ? "block" : "none";
});

const chkZidovi = document.getElementById("chkZidovi");
const formatZidWrap = document.getElementById("formatZidWrap");

chkZidovi?.addEventListener("change", () => {
  if (formatZidWrap)
    formatZidWrap.style.display = chkZidovi.checked ? "block" : "none";
});
