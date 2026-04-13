import { readFileSync } from "node:fs";

export function getBookSQL() {
  const filePath = "./sql/verses.sql";

  try {
    const content = readFileSync(filePath, "utf-8").split("\n");
    const lines = content.filter((l) => l.trim() !== "");

    const bookObj = lines
      .map((line) => {
        const match = line.match(/VALUES\s*\((.*)\)/i);

        if (!match) return null;

        const data = match[1].split(",").map((v) => v.trim().replace(/'/g, ""));

        return {
          id: parseInt(data[0]),
          name: data[1],
          abbrev: data[2],
          testament_id: parseInt(data[3]),
        };
      })
      .filter((obj) => obj !== null);

    return bookObj;
  } catch (err) {
    console.error("Could not read the file:", err.message);
    return [];
  }
}
