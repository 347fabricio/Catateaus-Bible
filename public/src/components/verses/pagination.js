import { buildVerses } from "./verses.js";

export function pagination() {
  const prevBtn = document.querySelector("#chevronLeft");
  const nextBtn = document.querySelector("#chevronRight");

  const isPrevBtnShowing = prevBtn.classList.contains("d-none");
  const isNextBtnShowing = nextBtn.classList.contains("d-none");

  if (!isPrevBtnShowing && !isNextBtnShowing) return;

  prevBtn.classList.remove("d-none");
  nextBtn.classList.remove("d-none");

  addOpacityEffect(prevBtn);
  addOpacityEffect(nextBtn);
  setupPaginationControls();
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
  const prevBtn = document.querySelector("#chevronLeft");
  const nextBtn = document.querySelector("#chevronRight");
  const booksEl = document.querySelector("#books");
  const versesDiv = document.querySelector("#verses");

  prevBtn.addEventListener("click", async () => {
    const currentBookId = parseInt(booksEl.dataset.bookId);
    let currentChapterId = parseInt(booksEl.dataset.chapterId);

    const nextChapterId = currentChapterId - 1;

    booksEl.dataset.chapterId = nextChapterId;

    versesDiv.classList.add("opacity-0");

    console.log(currentBookId, nextChapterId);

    setTimeout(async () => {
      await buildVerses(currentBookId, nextChapterId);
      versesDiv.classList.remove("opacity-0");
    }, 300);
  });

  nextBtn.addEventListener("click", () => {
    const currentBookId = parseInt(booksEl.dataset.bookId);
    let currentChapterId = parseInt(booksEl.dataset.chapterId);

    const nextChapterId = currentChapterId + 1;

    booksEl.dataset.chapterId = nextChapterId;

    versesDiv.classList.add("opacity-0");

    setTimeout(async () => {
      await buildVerses(currentBookId, nextChapterId);
      versesDiv.classList.remove("opacity-0");
    }, 300);
  });
}
