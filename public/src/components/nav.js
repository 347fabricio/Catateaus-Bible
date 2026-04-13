import { getBooks, getChapter, getVersions } from "../services/api.js";
import { buildVerses } from "./verses.js";

const bibleBooks = await getBooks();
const bibleVersions = await getVersions();

/**
 * Função principal de inicialização. Atua como o controlador da interface.
 */
function populateBookDiv() {
  const booksEl = document.querySelector("#books");
  const dropdownMenu = booksEl.querySelector(".dropdown-menu");
  const dropdownToggle = booksEl.querySelector(".dropdown-toggle");
  const chaptersEl = document.querySelector("#chapters");
  const liTemplate = dropdownMenu.querySelector("li");

  fixBootstrapDropdownScroll(dropdownToggle);
  populateBooksList(dropdownMenu, liTemplate, bibleBooks);
  setupMainButtonToggle(booksEl, dropdownMenu, chaptersEl);
  setupBookSelection(booksEl, dropdownMenu, chaptersEl);
}

/**
 * Remove o redimensionamento do Dropdown ao scrollar do Bootstrap com configurações personalizadas do popper.
 * @param {HTMLElement} toggleElement - O elemento de botão que aciona o dropdown.
 */
function fixBootstrapDropdownScroll(toggleElement) {
  new bootstrap.Dropdown(toggleElement, {
    popperConfig: {
      modifiers: [
        {
          name: "eventListeners",
          options: { scroll: false, resize: false },
        },
      ],
    },
  });
}

/**
 * Clona o modelo (template) para renderizar a lista de livros e, em seguida, remove o modelo original.
 * @param {HTMLElement} dropdownMenu - O contêiner do menu suspenso onde os livros serão adicionados.
 * @param {HTMLElement} templateItem - O elemento `li` usado como modelo para clonagem.
 * @param {Array<Object>} booksData - O array contendo os objetos de dados dos livros (ex: bibleBooks).
 */
function populateBooksList(dropdownMenu, templateItem, booksData) {
  booksData.forEach((book, index) => {
    const newLi = templateItem.cloneNode(true);
    newLi.querySelector("a").textContent = book.name;
    newLi.dataset.bookId = index + 1;
    newLi.dataset.bookName = book.name;
    dropdownMenu.append(newLi);
  });

  templateItem.remove();
}

/**
 * Lida com a lógica do botão principal do dropdown (exibir a lista de livros ou ocultar os capítulos).
 * @param {HTMLElement} booksEl - O contêiner principal do componente de livros.
 * @param {HTMLElement} dropdownMenu - O contêiner do menu suspenso.
 * @param {HTMLElement} chaptersEl - O contêiner que agrupa a grade de capítulos.
 */
function setupMainButtonToggle(booksEl, dropdownMenu, chaptersEl) {
  const booksBtn = booksEl.querySelector("button");

  booksBtn.addEventListener("click", () => {
    const isDropdownShown = booksEl.querySelector(".btn").classList.contains("show");

    if (isDropdownShown && chaptersEl.classList.contains("d-none")) {
      const listItems = dropdownMenu.querySelectorAll("li");
      listItems.forEach((li) => li.classList.remove("d-none"));
    } else {
      clearChapters(chaptersEl);
      chaptersEl.classList.add("d-none");
    }
  });
}

/**
 * Adiciona event listeners aos itens da lista de livros para buscar e exibir os capítulos.
 * @param {HTMLElement} booksEl - O contêiner principal do componente de livros.
 * @param {HTMLElement} dropdownMenu - O contêiner do menu suspenso contendo os livros.
 * @param {HTMLElement} chaptersEl - O contêiner onde os capítulos serão renderizados.
 */
function setupBookSelection(booksEl, dropdownMenu, chaptersEl) {
  const listItems = dropdownMenu.querySelectorAll("li");

  listItems.forEach((li, index) => {
    li.addEventListener("click", async () => {
      const bookId = li.dataset.bookId;
      const bookName = li.dataset.bookName;

      booksEl.dataset.bookId = bookId;
      booksEl.dataset.bookName = bookName;

      booksEl.querySelector("button").textContent = bookName;

      listItems.forEach((x) => x.classList.add("d-none"));

      await fetchAndRenderChapters(bookId, bookName, chaptersEl, booksEl);
    });
  });
}

/**
 * Busca a quantidade de capítulos na API/Banco de dados e aciona a renderização e a vinculação de eventos.
 * @param {string|number} bookId - O identificador único do livro selecionado.
 * @param {string} bookName - O nome do livro selecionado.
 * @param {HTMLElement} chaptersEl - O contêiner onde a grade de capítulos será renderizada.
 * @param {HTMLElement} booksEl - O contêiner principal do componente de livros.
 */
async function fetchAndRenderChapters(bookId, bookName, chaptersEl, booksEl) {
  const response = await getChapter(bookId, 999);
  const howManyChapters = response[0].chapter;

  renderChapterGrid(howManyChapters, chaptersEl);
  setupChapterSelection(chaptersEl, booksEl, bookName);

  chaptersEl.classList.remove("d-none");
}

/**
 * Renderiza a grade de botões correspondentes a cada capítulo do livro.
 * @param {number} chapterCount - A quantidade total de capítulos a serem renderizados.
 * @param {HTMLElement} chaptersEl - O contêiner que agrupa a grade de capítulos.
 */
function renderChapterGrid(chapterCount, chaptersEl) {
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
 * Adiciona ouvintes de eventos (event listeners) aos botões de capítulos gerados dinamicamente.
 * @param {HTMLElement} chaptersEl - O contêiner que possui os botões de capítulos gerados.
 * @param {HTMLElement} booksEl - O contêiner principal para atualizar o texto do botão.
 * @param {string} bookName - O nome do livro selecionado atual.
 */
function setupChapterSelection(chaptersEl, booksEl, bookName) {
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

      const bookId = booksEl.dataset.bookId;
      buildVerses(bookId, chapterId);

      clearChapters(chaptersEl);
    });
  });
}

/**
 * Função utilitária para remover as colunas de capítulos geradas, mantendo apenas o modelo original.
 * @param {HTMLElement} chaptersEl - O contêiner dos capítulos a ser limpo.
 */
function clearChapters(chaptersEl) {
  const cols = [...chaptersEl.querySelectorAll(".col")];
  const toRemove = cols.slice(1);
  toRemove.forEach((x) => x.remove());
}

function populateVersionsDiv() {
  const li = document.querySelector("#versions .dropdown-menu");

  bibleVersions.forEach((version) => {
    const newLi = li.querySelector("li").cloneNode(true);
    newLi.querySelector("a").textContent = version.name;
    li.append(newLi);
  });

  li.querySelector("li").remove();
}

export async function populateNav() {
  populateBookDiv();
  populateVersionsDiv();
}
populateNav();
