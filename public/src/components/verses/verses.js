import { getChapter } from "../../services/api.js";
import { hideNavigation } from "../header.js";

/**
 * Busca os versículos de um capítulo específico na API, ordena-os e os renderiza no DOM.
 * Limpa o conteúdo anterior e utiliza um modelo HTML (template) para construir a nova lista de versículos.
 * @param {number|string} bookId - O identificador único do livro bíblico.
 * @param {number|string} chapterId - O número ou identificador do capítulo a ser exibido.
 * @returns {Promise<void>} Uma promise que é resolvida após a busca e renderização completa dos versículos na interface.
 */
export async function buildVerses(bookId, chapterId) {
  const chapterData = await getChapter(bookId, chapterId);
  chapterData.sort((a, b) => a.verse - b.verse);

  const parent = document.querySelector("#verses");
  const versesTemplate = parent.querySelector(".verseTemplate");

  const isParentShowing = parent.classList.contains("d-none");
  if (isParentShowing) parent.classList.remove("d-none");

  const nonTemplate = parent.querySelectorAll("div");

  nonTemplate.forEach((el) => el.remove());

  const navDiv = document.querySelector("#navDiv");
  const chevronIcon = document.querySelector(".bi-chevron-compact-down");

  hideNavigation(navDiv, chevronIcon);
  createTitle(parent);
  scrollToTop();
  renderVerses(chapterData, parent, versesTemplate);
}

/**
 * Cria os versículos e os injeta no contêiner principal.
 * @param {Array} chapter - Array contendo os objetos de cada versículo.
 * @param {HTMLElement} parent - O contêiner onde os versículos serão inseridos.
 * @param {HTMLElement} template - O modelo HTML (span) para clonar.
 */
function renderVerses(chapter, parent, template) {
  const fragment = document.createDocumentFragment();

  chapter.forEach((verse) => {
    const verseNumber = template.querySelector(".verse-number").cloneNode();
    const verseText = template.querySelector(".verse-text").cloneNode();

    verseNumber.textContent = verse.verse;
    verseText.textContent = verse.text;
    verseNumber.classList.add("pe-1");

    const div = document.createElement("div");
    div.classList.add("mb-2");

    div.appendChild(verseNumber);
    div.appendChild(verseText);

    fragment.appendChild(div);
  });

  parent.appendChild(fragment);

  const lastDiv = parent.lastElementChild;
  if (lastDiv) lastDiv.classList.remove("mb-2");
}

/**
 * Cria e insere um título principal (h1) com o nome do livro e o número do capítulo atual.
 * Os dados são extraídos automaticamente dos atributos de dados `dataset` do elemento `#books`.
 * * @param {HTMLElement} parentEl - O elemento HTML pai onde o novo título será anexado.
 */
function createTitle(parentEl) {
  const div = document.createElement("div");
  const h1 = document.createElement("h1");
  h1.className = "display-4 fw-normal mb-3";
  div.appendChild(h1);

  const booksEl = document.querySelector("#books");
  const bookName = booksEl.dataset.bookName;
  const bookChapter = booksEl.dataset.chapterId;

  h1.textContent = `${bookName} ${bookChapter}`;

  parentEl.append(div);
}

/**
 * Rola suavemente a janela ou um elemento específico para o topo.
 * Útil para redefinir o estado da visualização após a navegação entre capítulos.
 * * @param {HTMLElement} [element=window] - O contêiner alvo que será rolado.
 * Por padrão, utiliza o objeto global `window`.
 */
const scrollToTop = (element = window) => {
  element.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
