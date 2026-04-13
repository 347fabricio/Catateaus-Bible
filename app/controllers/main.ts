import express from "express";
const router = express.Router();

import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

router.get("/", (req, res) => res.sendFile(path.join(__dirname, "..", "views", "main.html")));

export { router };
