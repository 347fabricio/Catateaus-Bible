import { getVersions } from "../../services/api.js";

/**
 * Adiciona ouvintes de eventos (event listeners) aos botões de capítulos gerados dinamicamente.
 * @param {HTMLElement} chaptersEl - O contêiner que possui os botões de capítulos gerados.
 * @param {HTMLElement} booksEl - O contêiner principal para atualizar o texto do botão.
 * @param {string} bookName - O nome do livro selecionado atual.
 */
export function setupVersionSelection(dropdownMenu) {
  const liVersion = dropdownMenu.querySelector("#versions");

  liVersion.addEventListener("click", async () => {
    liVersion.classList.remove("d-none");

    const listItems = dropdownMenu.querySelectorAll("li:not(#versions)");
    listItems.forEach((x) => x.classList.add("d-none"));

    const versionItems = dropdownMenu.querySelectorAll(".versionName");
    versionItems.forEach((x) => x.classList.remove("d-none"));

    hideVersionsSection(dropdownMenu);
    hideHr(dropdownMenu);

    const versionNames = dropdownMenu.querySelectorAll(".versionName");

    if (versionNames.length) return;

    const bibleVersions = await getVersions();
    bibleVersions.forEach((version) => {
      const newLiVersion = liVersion.cloneNode(true);
      newLiVersion.classList.add("versionName");
      newLiVersion.removeAttribute("id");
      newLiVersion.querySelector("button").textContent = version.name;
      newLiVersion.dataset.bookVersionId = version.id;
      newLiVersion.querySelector("button").classList.remove("fw-bold");
      newLiVersion.classList.remove("d-none");

      dropdownMenu.append(newLiVersion);
    });
  });

  hideVersionsSection(dropdownMenu);
}

/**
 * Exibe a seção de versões no menu suspenso.
 * @param {HTMLElement} dropdownMenu - O contêiner do menu suspenso onde os elementos estão localizados.
 */
export function showVersionsSection(dropdownMenu) {
  const liVersions = dropdownMenu.querySelector("#versions");
  const versionsBtn = liVersions.querySelector("button");
  const hr = dropdownMenu.querySelector("hr");

  versionsBtn.textContent = "Versões";
  liVersions.classList.remove("d-none");
  hr.classList.remove("d-none");
}

/**
 * Oculta a seção de versões no menu suspenso.
 * @param {HTMLElement} dropdownMenu - O contêiner do menu suspenso onde os elementos estão localizados.
 */
export function hideVersionsSection(dropdownMenu) {
  const liVersions = dropdownMenu.querySelector("#versions");
  liVersions.classList.add("d-none");
}

/**
 * Oculta todos os itens correspondentes aos nomes das versões bíblicas no menu suspenso.
 * @param {HTMLElement} dropdownMenu - O contêiner do menu suspenso onde os elementos estão localizados.
 */
export function hideVersionNames(dropdownMenu) {
  const versionNames = dropdownMenu.querySelectorAll(".versionName");
  versionNames.forEach((el) => el.classList.add("d-none"));
}

/**
 * Oculta a linha separadora no menu suspenso.
 * @param {HTMLElement} dropdownMenu - O contêiner do menu suspenso onde os elementos estão localizados.
 */
export function hideHr(dropdownMenu) {
  const hr = dropdownMenu.querySelector("hr");
  hr.classList.add("d-none");
}
