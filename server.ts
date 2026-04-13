import express from "express";
import cors from "cors";
const app = express();
const port = 3000;

app.use(cors());

import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "public")));

import books from "./app/controllers/books.js";
import chapters from "./app/controllers/chapters.js";
import verses from "./app/controllers/verses.js";
import versions from "./app/controllers/versions.js";

app.use("/api", books);
app.use("/api", chapters);
app.use("/api", verses);
app.use("/api", versions);

import { router as main } from "./app/controllers/main.js";

app.use("/", main);

app.listen(port, () => console.log(`Server running on port ${port}.`));
