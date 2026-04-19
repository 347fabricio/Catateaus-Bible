import { hideVersionsSection, hideHr } from "./versions.js";
import { fetchAndRenderChapters } from "./chapters.js";

/**
 * Adiciona event listeners aos itens da lista de livros para buscar e exibir os capítulos.
 * @param {HTMLElement} booksEl - O contêiner principal do componente de livros.
 * @param {HTMLElement} dropdownMenu - O contêiner do menu suspenso contendo os livros.
 * @param {HTMLElement} chaptersEl - O contêiner onde os capítulos serão renderizados.
 */
export function setupBookSelection(booksEl, dropdownMenu, chaptersEl) {
  const listItems = dropdownMenu.querySelectorAll("li:not(#versions):not(.versionName)");
  listItems.forEach((li, index) => {
    li.addEventListener("click", async () => {
      const bookId = li.dataset.bookId;
      const bookName = li.dataset.bookName;

      booksEl.dataset.bookId = bookId;
      booksEl.dataset.bookName = bookName;

      booksEl.querySelector("button").textContent = bookName;

      hideVersionsSection(dropdownMenu);
      hideHr(dropdownMenu);

      listItems.forEach((x) => x.classList.add("d-none"));

      await fetchAndRenderChapters(bookId, bookName, chaptersEl, booksEl);
    });
  });
}

/**
 * Clona o modelo (template) para renderizar a lista de livros e, em seguida, remove o modelo original.
 * @param {HTMLElement} dropdownMenu - O contêiner do menu suspenso onde os livros serão adicionados.
 * @param {HTMLElement} templateItem - O elemento `li` usado como modelo para clonagem.
 * @param {Array<Object>} booksData - O array contendo os objetos de dados dos livros da Bíblia.
 */
export function populateBooksList(dropdownMenu, templateItem, booksData) {
  booksData.forEach((book, index) => {
    const newLi = templateItem.cloneNode(true);
    newLi.removeAttribute("id");
    newLi.classList.remove("d-none");
    newLi.querySelector("button").textContent = book.name;
    newLi.dataset.bookId = index + 1;
    newLi.dataset.bookName = book.name;
    dropdownMenu.append(newLi);
  });

  templateItem.querySelector("button").classList.add("fw-bold");
}

/**
 * Atualiza o texto do botão de navegação principal para exibir o livro e o capítulo atuais
 * @param {HTMLElement} booksEl - O contêiner principal do componente de livros.
 * @param {string} bookName - O nome do livro selecionado.
 * @param {number|string} chapterId - O capítulo do livro selecionado.
 */
export function updateBookButton(booksEl, bookName, chapterId) {
  booksEl.querySelector("button").textContent = `${bookName} ${chapterId}`;
}
