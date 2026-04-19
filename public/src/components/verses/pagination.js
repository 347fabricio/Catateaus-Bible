import { debounce } from "../../lib/utils.js";
import { updateBookButton } from "../nav/books.js";
import { clearChapters } from "../nav/chapters.js";
import { buildVerses } from "./verses.js";

const uiElements = {
  parent: document.querySelector("#verses").parentElement,
  desktopPrev: document.querySelector("#prevBtn"),
  desktopNext: document.querySelector("#nextBtn"),
  pagination: document.querySelector("#pagination"),
  mobilePrev: document.querySelector(".mobile-prev"),
  mobileNext: document.querySelector(".mobile-next"),
  booksEl: document.querySelector("#books"),
};

export function pagination() {
  const prevBtn = document.querySelector("#prevBtn");
  const nextBtn = document.querySelector("#nextBtn");

  const isPrevBtnShowing = prevBtn.classList.contains("d-none");
  const isNextBtnShowing = nextBtn.classList.contains("d-none");

  if (!isPrevBtnShowing && !isNextBtnShowing) return;

  prevBtn.classList.remove("d-none");
  nextBtn.classList.remove("d-none");

  addOpacityEffect(prevBtn);
  addOpacityEffect(nextBtn);
  setupPaginationControls();

  // const mediaQuery = window.matchMedia("(max-width: 768px)");
  handleMobileSize();
  window.addEventListener("resize", debounce(handleMobileSize, 200));

  renderMobilePreviousPage(uiElements);
  renderMobileNextPage(uiElements);
}

/**
 * Adiciona um efeito visual de clique alterando a opacidade de um ícone SVG.
 * A opacidade aumenta, e o tamanho diminui ao pressionar o mouse. Retorna ao estado inicial ao soltar o elemento.
 * @param {HTMLElement} element - O elemento HTML interativo que contém o ícone SVG.
 */
function addOpacityEffect(element) {
  const svg = element.querySelector("svg");

  element.addEventListener("mousedown", () => svg.classList.replace("opacity-25", "opacity-75"));
  element.addEventListener("mouseup", () => svg.classList.replace("opacity-75", "opacity-25"));
}

/**
 * Configura os controles de paginação (botões de voltar e avançar) para navegar entre os capítulos.
 *
 * Lê o estado atual (livro e capítulo) a partir dos atributos `data-book-id` e `data-chapter-id`, calcula o próximo capítulo a ser exibido e aciona a renderização com um efeito visual de transição suave (fade).
 */
async function setupPaginationControls() {
  const prevBtn = document.querySelector("#prevBtn");
  const nextBtn = document.querySelector("#nextBtn");
  const booksEl = document.querySelector("#books");
  const versesDiv = document.querySelector("#verses");

  prevBtn.addEventListener("click", async () => {
    const currentBookId = parseInt(booksEl.dataset.bookId);
    const currentChapterId = parseInt(booksEl.dataset.chapterId);

    if (currentChapterId == 1) return;

    const nextChapterId = currentChapterId - 1;

    const bookName = booksEl.dataset.bookName;
    updateBookButton(bookName, nextChapterId);

    booksEl.dataset.chapterId = nextChapterId;

    versesDiv.classList.add("opacity-0");

    setTimeout(async () => {
      await buildVerses(currentBookId, nextChapterId);
      versesDiv.classList.remove("opacity-0");
    }, 300);
  });

  nextBtn.addEventListener("click", () => {
    const currentBookId = parseInt(booksEl.dataset.bookId);
    const currentChapterId = parseInt(booksEl.dataset.chapterId);
    const howManyChapters = parseInt(booksEl.dataset.maxChapters);

    if (currentChapterId === howManyChapters) return;

    const nextChapterId = currentChapterId + 1;

    const bookName = booksEl.dataset.bookName;
    updateBookButton(bookName, nextChapterId);

    booksEl.dataset.chapterId = nextChapterId;

    versesDiv.classList.add("opacity-0");

    setTimeout(async () => {
      await buildVerses(currentBookId, nextChapterId);
      versesDiv.classList.remove("opacity-0");
    }, 300);
  });
}

function handleMobileSize() {
  const width = window.innerWidth;
  const MOBILE_BREAKPOINT = 768;

  if (width <= MOBILE_BREAKPOINT) {
    applyMobileLayout(uiElements);
    handleMobilePagination(uiElements);
  } else {
    applyDesktopLayout(uiElements);
  }
}

/**
 * Applies the mobile-specific column layout and
 * hides the side navigation buttons.
 */
function applyMobileLayout(uiElements) {
  uiElements.desktopPrev.classList.add("d-none");
  uiElements.desktopNext.classList.add("d-none");

  uiElements.parent.classList.add("flex-column");
  uiElements.parent.classList.replace("justify-content-center", "align-items-center");

  uiElements.pagination.classList.replace("d-none", "d-flex");
}

/**
 * Applies the desktop-specific row layout and
 * restores the side navigation buttons.
 */
function applyDesktopLayout(uiElements) {
  uiElements.desktopPrev.classList.remove("d-none");
  uiElements.desktopNext.classList.remove("d-none");

  uiElements.parent.classList.remove("flex-column");
  uiElements.parent.classList.replace("align-items-center", "justify-content-center");

  uiElements.pagination.classList.replace("d-flex", "d-none");
}

function handleMobilePagination(uiElements) {
  const booksEl = document.querySelector("#books");
  const { bookName, bookId, chapterId, maxChapters: totalChapters } = booksEl.dataset;

  const currentChapter = parseInt(chapterId);
  const maxChapters = parseInt(totalChapters);

  uiElements.mobilePrev.classList.remove("disabled");
  uiElements.mobileNext.classList.remove("disabled");

  uiElements.mobilePrev.dataset.bookName = bookName;
  uiElements.mobileNext.dataset.bookName = bookName;
  uiElements.mobilePrev.dataset.bookId = bookId;
  uiElements.mobileNext.dataset.bookId = bookId;

  if (currentChapter === 1) {
    uiElements.mobilePrev.textContent = bookName;
    uiElements.mobilePrev.classList.add("disabled");
    delete uiElements.mobilePrev.dataset.chapterId;

    uiElements.mobileNext.textContent = `${bookName} ${currentChapter + 1}`;
    uiElements.mobileNext.dataset.chapterId = currentChapter + 1;
    return;
  }

  if (currentChapter === maxChapters) {
    uiElements.mobilePrev.textContent = `${bookName} ${currentChapter - 1}`;
    uiElements.mobilePrev.dataset.chapterId = currentChapter - 1;

    uiElements.mobileNext.textContent = bookName;
    uiElements.mobileNext.classList.add("disabled");
    delete uiElements.mobileNext.dataset.chapterId;
    return;
  }

  uiElements.mobilePrev.textContent = `${bookName} ${currentChapter - 1}`;
  uiElements.mobilePrev.dataset.chapterId = currentChapter - 1;

  uiElements.mobileNext.textContent = `${bookName} ${currentChapter + 1}`;
  uiElements.mobileNext.dataset.chapterId = currentChapter + 1;
}

function renderMobilePreviousPage(uiElements) {
  uiElements.mobilePrev.addEventListener("click", async () => {
    const bookId = uiElements.mobilePrev.dataset.bookId;
    const chapterId = uiElements.mobilePrev.dataset.chapterId;
    const bookName = uiElements.mobilePrev.dataset.bookName;

    uiElements.booksEl.dataset.bookId = bookId;
    uiElements.booksEl.dataset.chapterId = chapterId;

    updateBookButton(bookName, chapterId);
    await buildVerses(bookId, chapterId);
    pagination();
  });
}

function renderMobileNextPage(uiElements) {
  uiElements.mobileNext.addEventListener("click", async () => {
    const bookId = uiElements.mobileNext.dataset.bookId;
    const chapterId = uiElements.mobileNext.dataset.chapterId;
    const bookName = uiElements.mobileNext.dataset.bookName;

    uiElements.booksEl.dataset.bookId = bookId;
    uiElements.booksEl.dataset.chapterId = chapterId;

    updateBookButton(bookName, chapterId);
    await buildVerses(bookId, chapterId);
    pagination();
  });
}
