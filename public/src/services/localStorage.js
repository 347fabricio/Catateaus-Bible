const BOOKS_STORAGE_KEY = "@mihi_biblie:books";
const CHAPTERS_STORAGE_KEY = "@mihi_biblie:chapters";

/**
 * Salva o array de livros da Bíblia no armazenamento local do navegador.
 * @param {Array} booksArray - Array de objetos contendo os dados dos livros.
 */
export function pushBooks(booksArray) {
  const booksString = JSON.stringify(booksArray);
  localStorage.setItem(BOOKS_STORAGE_KEY, booksString);
}

/**
 * Busca a lista de livros armazenada no navegador.
 * @returns {Array|null} Retorna o array de livros ou null se não houver cache.
 */
export function pullBooks() {
  const storedBooks = localStorage.getItem(BOOKS_STORAGE_KEY);

  return storedBooks ? JSON.parse(storedBooks) : null;
}

/**
 * Busca os capítulos de um livro específico no cache.
 * @param {number|string} bookId - O ID do livro.
 * @returns {Array|null} Retorna os capítulos do livro ou null se não houver.
 */
export function pullChapters(bookId) {
  const storedChapters = localStorage.getItem(BOOKS_STORAGE_KEY);

  if (!storedChapters) return null;

  const allChapters = JSON.parse(storedChapters);

  return allChapters[bookId] || null;
}

/**
 * Salva os capítulos de um livro específico no cache, sem apagar os outros.
 * @param {number|string} bookId - O ID do livro.
 * @param {Array} chaptersArray - O array de capítulos retornados da API.
 */
export function pushChapters(bookId, chaptersArray) {
  const storedChapters = localStorage.getItem(CHAPTERS_STORAGE_KEY);
  const allChapters = storedChapters ? JSON.parse(storedChapters) : {};

  if (Object.keys(allChapters).includes(bookId)) return;

  let sortedBooks, oldestBooks;
  if (Object.keys(allChapters).length >= 5) {
    sortedBooks = Object.entries(allChapters)
      .map((book) => ({
        bId: book[0],
        timestamp: book[1].at(-1).timestamp,
      }))
      .sort((a, b) => b.timestamp - a.timestamp);

    oldestBooks = sortedBooks.slice(0, 5);

    const booksToKeep = oldestBooks.map((b) => b.bId);
    Object.keys(allChapters).forEach((bId) => {
      if (!booksToKeep.includes(bId)) delete allChapters[bId];
    });
  }

  const now = new Date().getTime();

  chaptersArray.push({
    timestamp: now,
  });

  allChapters[bookId] = chaptersArray;

  localStorage.setItem(CHAPTERS_STORAGE_KEY, JSON.stringify(allChapters));
}

function pullVersions() {}

function pushVersions() {}
