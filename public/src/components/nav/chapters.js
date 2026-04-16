import { buildVerses } from "../verses/verses.js";
import { getChapter, getChapters } from "../../services/api.js";
import { pagination } from "../verses/pagination.js";
import { pushChapters } from "../../services/localStorage.js";

/**
 * Adiciona ouvintes de eventos (event listeners) aos botões de capítulos gerados dinamicamente.
 * @param {HTMLElement} chaptersEl - O contêiner que possui os botões de capítulos gerados.
 * @param {HTMLElement} booksEl - O contêiner principal para atualizar o texto do botão.
 * @param {string} bookName - O nome do livro selecionado atual.
 */
export function setupChapterSelection(chaptersEl, booksEl, bookName) {
  const chapterButtons = chaptersEl.querySelectorAll(".col:not(.d-none) button");

  chapterButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const chapterId = e.target.textContent.trim();
      booksEl.dataset.chapterId = chapterId;
      booksEl.querySelector("button").textContent = `${bookName} ${chapterId}`;

      const dropdownToggle = booksEl.querySelector(".dropdown-toggle");
      const dropdownInstance = bootstrap.Dropdown.getInstance(dropdownToggle);
      if (dropdownInstance) {
        dropdownInstance.hide();
      }

      chaptersEl.classList.add("d-none");

      HideWelcomeScreen();

      const bookId = booksEl.dataset.bookId;
      buildVerses(bookId, chapterId);

      clearChapters(chaptersEl);
      pagination();
    });
  });
}

function HideWelcomeScreen() {
  const welcomeScr = document.querySelector("#welcome-screen");
  welcomeScr.classList.add("d-none");
}

/**
 * Busca a quantidade de capítulos na API/Banco de dados e aciona a renderização e a vinculação de eventos.
 * @param {string|number} bookId - O identificador único do livro selecionado.
 * @param {string} bookName - O nome do livro selecionado.
 * @param {HTMLElement} chaptersEl - O contêiner onde a grade de capítulos será renderizada.
 * @param {HTMLElement} booksEl - O contêiner principal do componente de livros.
 */
export async function fetchAndRenderChapters(bookId, bookName, chaptersEl, booksEl) {
  const response = await getChapter(bookId, 999);
  const howManyChapters = response[0].chapter;

  await getChapters(bookId);

  renderChapterGrid(howManyChapters, chaptersEl);
  setupChapterSelection(chaptersEl, booksEl, bookName);

  chaptersEl.classList.remove("d-none");
}

/**
 * Renderiza a grade de botões correspondentes a cada capítulo do livro.
 * @param {number} chapterCount - A quantidade total de capítulos a serem renderizados.
 * @param {HTMLElement} chaptersEl - O contêiner que agrupa a grade de capítulos.
 */
export function renderChapterGrid(chapterCount, chaptersEl) {
  const row = chaptersEl.querySelector(".row");
  const templateCol = chaptersEl.querySelector(".col");

  clearChapters(chaptersEl);

  for (let i = 1; i <= chapterCount; i++) {
    const col = templateCol.cloneNode(true);
    col.querySelector("button").textContent = i;
    col.classList.remove("d-none");
    row.append(col);
  }
}

/**
 * Função utilitária para remover as colunas de capítulos geradas, mantendo apenas o modelo original.
 * @param {HTMLElement} chaptersEl - O contêiner dos capítulos a ser limpo.
 */
export function clearChapters(chaptersEl) {
  const cols = chaptersEl.querySelectorAll(".col");
  const toRemove = [...cols].slice(1);
  toRemove.forEach((x) => x.remove());
}
