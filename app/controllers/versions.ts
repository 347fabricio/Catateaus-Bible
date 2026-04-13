import express from "express";
const router = express.Router();

import { prisma } from "../../public/src/lib/prisma.js";

/**
 * @route GET /versions
 * @description Busca e retorna uma lista com todos as versões da Bíblia cadastrados no banco de dados.
 */
router.get("/versions", async (req, res) => {
  try {
    const versions = await prisma.version.findMany();

    return res.json(versions);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

export default router;
