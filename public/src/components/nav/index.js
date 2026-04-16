import { getBooks, getVersions } from "../../services/api.js";
import { fixBootstrapDropdownScroll } from "../../lib/utils.js";
import { populateBooksList, setupBookSelection } from "./books.js";
import { setupVersionSelection } from "./versions.js";
import { setupMainButtonToggle } from "./uiToggles.js";
import { pushBooks, pullBooks } from "../../services/localStorage.js";

/**
 * Função de inicialização principal (Entry Point) do componente de navegação.
 * Centraliza e dispara a configuração de livros, capítulos e versões.
 */
export async function populateNav() {
  const bibleBooks = pullBooks() || (await getBooks());
  const bibleVersions = await getVersions();

  const booksEl = document.querySelector("#books");
  const dropdownMenu = booksEl.querySelector(".dropdown-menu");
  const dropdownToggle = booksEl.querySelector(".dropdown-toggle");
  const chaptersEl = document.querySelector("#chapters");
  const liTemplate = dropdownMenu.querySelector("li");

  fixBootstrapDropdownScroll(dropdownToggle);

  populateBooksList(dropdownMenu, liTemplate, bibleBooks);
  setupMainButtonToggle(booksEl, dropdownMenu, chaptersEl);
  setupBookSelection(booksEl, dropdownMenu, chaptersEl);
  setupVersionSelection(dropdownMenu, bibleVersions);
}
populateNav();
