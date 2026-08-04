// ==========================================================================
// MESIN PAGES — BILINGUAL SYSTEM (BAHASA INDONESIA / ENGLISH)
// Shared across hdi-600.html, teba-450.html, zt-450.html
// ==========================================================================

let mesinTranslations = {};
let currentLang = localStorage.getItem("lang") || "id";

async function initMesinLanguageSystem() {
  try {
    const isSubFolder = window.location.pathname.includes("/mesin/");
    const basePath = isSubFolder ? "../lang/" : "./lang/";
    const [idRes, enRes] = await Promise.all([
      fetch(`${basePath}id.json`),
      fetch(`${basePath}en.json`)
    ]);

    mesinTranslations.id = await idRes.json();
    mesinTranslations.en = await enRes.json();

    applyTranslations(currentLang);
    updateLangButton(currentLang);
  } catch (err) {
    console.error("Gagal memuat file bahasa JSON di halaman mesin:", err);
  }
}

function applyTranslations(lang) {
  const t = mesinTranslations[lang];
  if (!t) return;
  document.body.classList.add("lang-switching");
  setTimeout(() => document.body.classList.remove("lang-switching"), 400);
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) el.textContent = t[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (t[key] !== undefined) el.placeholder = t[key];
  });
  document.documentElement.lang = lang;
}

function updateLangButton(lang) {
  const btn   = document.getElementById("lang-toggle");
  const label = document.getElementById("lang-label");
  const flag  = btn ? btn.querySelector(".lang-flag") : null;
  if (!btn || !label) return;
  if (lang === "id") {
    label.textContent = "ID";
    if (flag) flag.textContent = "🇮🇩";
    btn.classList.remove("lang-en");
    btn.title = "Switch to English";
  } else {
    label.textContent = "EN";
    if (flag) flag.textContent = "🇬🇧";
    btn.classList.add("lang-en");
    btn.title = "Ganti ke Bahasa Indonesia";
  }
}

function switchLanguage() {
  currentLang = currentLang === "id" ? "en" : "id";
  localStorage.setItem("lang", currentLang);
  applyTranslations(currentLang);
  updateLangButton(currentLang);
  if (typeof lucide !== "undefined") lucide.createIcons();
}

document.addEventListener("DOMContentLoaded", () => {
  initMesinLanguageSystem();
  const langBtn = document.getElementById("lang-toggle");
  if (langBtn) langBtn.addEventListener("click", switchLanguage);

  // Newsletter handler
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterMsg  = document.getElementById("newsletter-msg");
  if (newsletterForm && newsletterMsg) {
    newsletterForm.addEventListener("submit", e => {
      e.preventDefault();
      const btn = newsletterForm.querySelector("button");
      btn.disabled = true;
      setTimeout(() => {
        newsletterForm.reset();
        btn.disabled = false;
        newsletterMsg.style.display = "block";
        setTimeout(() => { newsletterMsg.style.display = "none"; }, 5000);
      }, 1000);
    });
  }
});
