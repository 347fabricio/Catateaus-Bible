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
  const chapter = await getChapter(bookId, chapterId);
  chapter.sort((a, b) => a.verse - b.verse);

  const parent = document.querySelector("#verses");
  const versesTemplate = parent.querySelector(".verseTemplate");

  const nonTemplate = parent.querySelectorAll("div");

  nonTemplate.forEach((el) => el.remove());

  const navDiv = document.querySelector("#navDiv");
  const chevronIcon = document.querySelector(".bi-chevron-compact-down");
  hideNavigation(navDiv, chevronIcon);

  chapter.forEach((verse) => {
    const verseNumber = versesTemplate.querySelector(".verse-number").cloneNode();
    const verseText = versesTemplate.querySelector(".verse-text").cloneNode();

    verseNumber.textContent = verse.verse;
    verseText.textContent = verse.text;

    verseNumber.classList.add("pe-1");

    const div = document.createElement("div");
    div.classList.add("mb-2");

    div.appendChild(verseNumber);
    div.appendChild(verseText);

    parent.appendChild(div);
  });

  const lastDiv = parent.querySelectorAll("div");
  if (lastDiv.length > 0) lastDiv[lastDiv.length - 1].removeAttribute("class");
}
