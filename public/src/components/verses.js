import { getChapter } from "../services/api.js";

export async function buildVerses(bookId, chapterId) {
  // console.log(`bookId: ${bookId}\thapterId: ${chapterId}`);
  const chapter = await getChapter(bookId, chapterId);

  const versesTemplate = document.querySelector("#verses");

  const nonTemplate = versesTemplate.querySelectorAll(".verse:not(.d-none)");
  nonTemplate.forEach((el) => el.remove());

  chapter.forEach((verse) => {
    const newVerse = versesTemplate.querySelector("span").cloneNode(true);
    newVerse.classList.remove("d-none");

    const verseNumber = newVerse.querySelector(".verse-number");
    const verseText = newVerse.querySelector(".verse-text");

    verseNumber.textContent = verse.verse;
    verseText.textContent = verse.text;

    versesTemplate.append(newVerse);
  });

  versesTemplate.querySelector(".verse:not(.d-none)").classList.add("ps-3");
}
