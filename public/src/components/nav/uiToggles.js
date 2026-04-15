import { showVersionsSection, hideVersionNames } from "./versions.js";
import { clearChapters } from "./chapters.js";

/**
 * Lida com a lógica do botão principal do dropdown (exibir a lista de livros ou ocultar os capítulos).
 * @param {HTMLElement} booksEl - O contêiner principal do componente de livros.
 * @param {HTMLElement} dropdownMenu - O contêiner do menu suspenso.
 * @param {HTMLElement} chaptersEl - O contêiner que agrupa a grade de capítulos.
 */
export function setupMainButtonToggle(booksEl, dropdownMenu, chaptersEl) {
  const booksBtn = booksEl.querySelector("button");

  booksBtn.addEventListener("click", () => {
    const isDropdownShown = booksEl.querySelector(".btn").classList.contains("show");
    const versionItems = dropdownMenu.querySelectorAll(".versionName");

    if (isDropdownShown && chaptersEl.classList.contains("d-none")) {
      showVersionsSection(dropdownMenu);

      const listItems = dropdownMenu.querySelectorAll("li:not(.versionName)");
      listItems.forEach((li) => li.classList.remove("d-none"));
    } else if (versionItems.length) {
      hideVersionNames(dropdownMenu);
    } else {
      clearChapters(chaptersEl);
      chaptersEl.classList.add("d-none");
    }
  });
}
