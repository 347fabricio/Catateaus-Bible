import express from "express";
const router = express.Router();

import { prisma } from "../../public/src/lib/prisma.js";

/**
 * @route GET /books
 * @description Busca e retorna uma lista com todos os livros da Bíblia cadastrados no banco de dados.
 */
router.get("/books", async (req, res) => {
  try {
    const books = await prisma.book.findMany();

    return res.json(books);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

/**
 * @route GET /book/:bookId
 * @description Busca um livro específico da Bíblia baseado no seu ID.
 *              Possui um sistema de "fallback" de limites:
 *              Se o ID solicitado for menor que 1, a busca é ajustada para o livro 1.
 *              Se for maior que 66, a busca é ajustada para o livro 66.
 */
router.get("/book/:bookId", async (req, res) => {
  try {
    const idStr = req.params.bookId;
    let id = Number.parseInt(idStr);

    switch (true) {
      case id < 1:
        id = 1;
        break;
      case id > 66:
        id = 66;
        break;
      case Number.isNaN(id):
        throw { status: 404, message: "Book was not found" };
    }

    const book = await prisma.book.findMany({
      where: {
        id: id,
      },
    });

    return res.json(book);
  } catch (err) {
    if (err.status === 404) return res.status(err.status).json({ message: err.message });

    console.error("Database error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

export default router;
