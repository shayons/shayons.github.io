// Run in the head so a saved preference takes effect before the page paints.
(() => {
  const root = document.documentElement;
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  const key = "color-theme";
  const preference = (value) => (value === "light" || value === "dark" ? value : "system");
  let choice = "system";

  try {
    choice = preference(localStorage.getItem(key));
  } catch {
    // Automatic theming and the picker still work when storage is unavailable.
  }

  function apply() {
    root.dataset.theme = choice;
    const dark = choice === "dark" || (choice === "system" && system.matches);
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.setAttribute("content", dark ? "#18181b" : "#ffffff");
    });
    const picker = document.getElementById("color-theme");
    if (picker instanceof HTMLSelectElement) picker.value = choice;
  }

  apply();
  system.addEventListener("change", apply);
  window.addEventListener("storage", (event) => {
    if (event.key === key || event.key === null) {
      choice = preference(event.newValue);
      apply();
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const picker = document.getElementById("color-theme");
    const control = document.querySelector("[data-theme-picker]");
    if (!(picker instanceof HTMLSelectElement) || !(control instanceof HTMLElement)) return;
    picker.value = choice;
    control.hidden = false;
    picker.addEventListener("change", () => {
      choice = preference(picker.value);
      apply();
      try {
        if (choice === "system") localStorage.removeItem(key);
        else localStorage.setItem(key, choice);
      } catch {
        // Keep the selected theme for this page even if it cannot be saved.
      }
    });
  });
})();
