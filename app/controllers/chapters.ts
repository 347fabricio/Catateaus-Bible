import express from "express";
const router = express.Router();

import { prisma } from "../../public/src/lib/prisma.js";

/**
 * @route GET /books/:bookId/chapters
 * @description Busca os capítulos/versículos de um livro específico da Bíblia.
 *              Se o ID do livro for menor que 1 (Gênesis) ou maior que 66 (Apocalipse), ajusta para o primeiro ou último livro.
 **/
router.get("/books/:bookId/chapters", async (req, res) => {
  try {
    const bookStr = req.params.bookId;
    let bookId = Number.parseInt(bookStr, 10);

    let chapters;

    switch (true) {
      case bookId < 1:
        chapters = await prisma.verse.findMany({
          where: {
            book_id: 1,
          },
        });
        break;
      case bookId > 66:
        chapters = await prisma.verse.findMany({
          where: {
            book_id: 66,
          },
        });
        break;
      case Number.isNaN(bookId):
        throw { status: 404, message: "Chapter was not found" };
      default:
        chapters = await prisma.verse.findMany({
          where: { book_id: bookId },
        });
    }

    return res.json(chapters);
  } catch (err) {
    if (err.status === 404) return res.status(err.status).json({ message: err.message });

    console.error("Database error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

/**
 * @route GET /books/:bookId/chapters/:chapterId
 * @description Busca os versículos de um capítulo específico dentro de um livro da Bíblia.
 *              Possui um sistema de "fallback" (ajuste automático) em duas etapas:
 *              1. Se o ID do livro for menor que 1 ou maior que 66, ajusta para o primeiro ou último livro.
 *              2. Se o ID do capítulo do livro for menor que o 1 ou maior que o último, ajusta para os limites do livro selecionado (semelhante a 1ª etapa).
 */
router.get("/books/:bookId/chapters/:chapterId", async (req, res) => {
  try {
    // 1st Step
    const { bookId: bookStr, chapterId: chapterStr } = req.params;
    let bookId = Number.parseInt(bookStr, 10);
    let chapterId = Number.parseInt(chapterStr, 10);

    let books;

    switch (true) {
      case Number.isNaN(bookId):
        throw { status: 404, message: "Book was not found" };
      case bookId < 1:
        books = await prisma.verse.findMany({
          where: {
            book_id: 1,
          },
        });
        break;
      case bookId > 66:
        books = await prisma.verse.findMany({
          where: {
            book_id: 66,
          },
        });
        break;
      default:
        books = await prisma.verse.findMany({
          where: { book_id: bookId },
        });
    }

    // 2nd Step
    let chapterVerses;
    const firstChapter = 1;
    const lastChapter = books[books.length - 1].chapter;

    switch (true) {
      case Number.isNaN(chapterId):
        throw { status: 404, message: "Chapter was not found" };
      case chapterId < firstChapter:
        chapterVerses = books.filter((book) => book.chapter === 1);
        break;
      case chapterId > lastChapter:
        chapterVerses = books.filter((book) => book.chapter === lastChapter);
        break;
      default:
        chapterVerses = books.filter((book) => book.chapter === chapterId);
    }

    return res.json(chapterVerses);
  } catch (err) {
    if (err.status === 404) return res.status(err.status).json({ message: err.message });

    console.error("Database error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

export default router;
