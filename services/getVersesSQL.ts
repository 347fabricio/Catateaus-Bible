import { createReadStream } from "node:fs";
import readline from "node:readline";

const bible = {
  velhoTestamento: [
    ["Gênesis", "gn"],
    ["Êxodo", "ex"],
    ["Levítico", "lv"],
    ["Números", "nm"],
    ["Deuteronômio", "dt"],
    ["Josué", "js"],
    ["Juízes", "jz"],
    ["Rute", "rt"],
    ["1 Samuel", "1sm"],
    ["2 Samuel", "2sm"],
    ["1 Reis", "1rs"],
    ["2 Reis", "2rs"],
    ["1 Crônicas", "1cr"],
    ["2 Crônicas", "2cr"],
    ["Esdras", "ed"],
    ["Neemias", "ne"],
    ["Ester", "et"],
    ["Jó", "job"],
    ["Salmos", "sl"],
    ["Provérbios", "pv"],
    ["Eclesiastes", "ec"],
    ["Cânticos", "ct"],
    ["Isaías", "is"],
    ["Jeremias", "jr"],
    ["Lamentações", "lm"],
    ["Ezequiel", "ez"],
    ["Daniel", "dn"],
    ["Oséias", "os"],
    ["Joel", "jl"],
    ["Amós", "am"],
    ["Obadias", "ob"],
    ["Jonas", "jn"],
    ["Miquéias", "mq"],
    ["Naum", "na"],
    ["Habacuque", "hc"],
    ["Sofonias", "sf"],
    ["Ageu", "ag"],
    ["Zacarias", "zc"],
    ["Malaquias", "ml"],
  ],
  novoTestamento: [
    ["Mateus", "mt"],
    ["Marcos", "mc"],
    ["Lucas", "lc"],
    ["João", "jo"],
    ["Atos", "at"],
    ["Romanos", "rm"],
    ["1ª Coríntios", "1co"],
    ["2ª Coríntios", "2co"],
    ["Gálatas", "gl"],
    ["Efésios", "ef"],
    ["Filipenses", "fp"],
    ["Colossenses", "cl"],
    ["1ª Tessalonicenses", "1ts"],
    ["2ª Tessalonicenses", "2ts"],
    ["1ª Timóteo", "1tm"],
    ["2ª Timóteo", "2tm"],
    ["Tito", "tt"],
    ["Filemom", "fm"],
    ["Hebreus", "hb"],
    ["Tiago", "tg"],
    ["1ª Pedro", "1pe"],
    ["2ª Pedro", "2pe"],
    ["1ª João", "1jo"],
    ["2ª João", "2jo"],
    ["3ª João", "3jo"],
    ["Judas", "jd"],
    ["Apocalipse", "ap"],
  ],
};

export async function getVersesSQL() {
  const filePath = "./sql/verses.sql";
  const verseObjects = [];
  let id = 1;

  try {
    const fileStream = createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      const match = trimmedLine.match(/VALUES\s*\((.*)\)/i);
      if (!match) continue;

      const commaIndices = [];
      let pos = -1;
      for (let i = 0; i < 5; i++) {
        pos = match[1].indexOf(",", pos + 1);
        commaIndices.push(pos);
      }

      const data = match[1].split(",").map((v) => v.trim().replace(/'/g, ""));

      const rawText = match[1].slice(commaIndices[4] + 1).trim();
      const cleanText = rawText.replace(/^'|'$/g, "");

      const allBooks = [...bible.velhoTestamento, ...bible.novoTestamento];
      const book_id = allBooks.findIndex(([name, abbrev]) => name === data[2]) + 1;

      verseObjects.push({
        id: id++,
        chapter: parseInt(data[3]),
        verse: parseInt(data[4]),
        text: cleanText,
        book_id: book_id,
        version_id: 0,
      });
    }

    return verseObjects;
  } catch (err) {
    console.error("Stream reading failed:", err.message);
    return [];
  }
}

// const verses = await getVersesSQL();
// console.log(verses[31000]);
