import express from "express";
const router = express.Router();

import { prisma } from "../../public/src/lib/prisma.js";

/**
 * @route GET /verses/:verseId/next
 * @description Calcula e busca o próximo versículo da Bíblia com base no ID fornecido.
 *              Possui um sistema de "fallback" para os limites da Bíblia:
 *              Se o cálculo resultar em um ID menor que 1, retorna o primeiro versículo.
 *              Se o cálculo ultrapassar 31.102 (último versículo de Apocalipse), ajusta para o último versículo (31.102).
 */
router.get("/verses/:verseId/next", async (req, res) => {
  try {
    const idStr = req.params.verseId;
    let next = parseInt(idStr) + 1;

    switch (true) {
      case next < 1:
        next = 1;
        break;
      case next > 31_102:
        next = 31_102;
        break;
      case Number.isNaN(next):
        throw { status: 404, message: "Verse was not found" };
    }

    const books = await prisma.verse.findMany({
      where: { id: next },
    });

    return res.json(books);
  } catch (err) {
    if (err.status === 404) return res.status(err.status).json({ message: err.message });

    console.error("Database error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

/**
 * @route GET /verses/:verseId/previous
 * @description Calcula e busca o versículo anterior da Bíblia com base no ID fornecido.
 *              Possui um sistema de "fallback" para os limites da Bíblia:
 *              Se o cálculo resultar em um ID menor que 1, retorna o primeiro versículo.
 *              Se o cálculo ultrapassar 31.102 (último versículo de Apocalipse), ajusta para o último versículo (31.102).
 */
router.get("/verses/:verseId/previous", async (req, res) => {
  try {
    const idStr = req.params.verseId;
    let previous = parseInt(idStr) - 1;

    switch (true) {
      case previous < 1:
        previous = 1;
        break;
      case previous > 31_102:
        previous = 31_102;
        break;
      case Number.isNaN(previous):
        throw { status: 404, message: "Verse was not found" };
    }

    const books = await prisma.verse.findMany({
      where: { id: previous },
    });

    return res.json(books);
  } catch (err) {
    if (err.status === 404) return res.status(err.status).json({ message: err.message });

    console.error("Database error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

export default router;
