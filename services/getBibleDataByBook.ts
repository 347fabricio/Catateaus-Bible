import { parse } from "node-html-parser";
import { appendFileSync } from "node:fs";

let chapterId = 1;
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

function findAbbrev(bookNames) {
  for (const [testament, books] of Object.entries(bible)) {
    for (const [name, abbrev] of books) {
      if (name === bookNames) return { name, abbrev, testament };
    }
  }

  return `"${bookNames}" was not found.`;
}

// function findAbbrevs(bookNames) {
//   const foundBooks = [];

//   for (const name of bookNames) {
//     const result = findAbbrev(name);

//     !result ? console.log(`"${name}" was not found.`) : foundBooks.push(result);
//   }

//   return foundBooks;
// }

// function getBooksAbbrev(bookNames) {
//   if (bookNames.length === 0) {
//     console.log("No books provided in the list.");
//     return [];
//   }

//   return Array.isArray(bookNames) ? findAbbrevs(bookNames) : findAbbrev(bookNames);
// }

async function getBibleDataByBook(names) {
  const books = findAbbrev(names);
  console.log(books);

  while (true) {
    try {
      const url = `https://www.bibliaonline.com.br/bkj/${books.abbrev}/${chapterId}`;
      const response = await fetch(url);
      const html = await response.text();

      const root = parse(html);
      const elements = root.querySelectorAll("._coreBibleStyles_m32eb_2 .t");

      if (elements.length === 0) {
        throw new Error(`\t\t\tReached end of ${books.name} at chapter ${chapterId - 1}.`);
      }

      elements.forEach((element, elementId) => {
        const versesSQL = `INSERT INTO verses(version, testament, book, chapter, verse, text) VALUES (${"'bkj'"}, '${books.testament}', '${books.name}', '${chapterId}', '${elementId + 1}', '${element.textContent}');\n`;
        appendFileSync("./sql/byBook.sql", versesSQL);
      });

      console.log(`\t\tSuccess: ${books.name} chapter ${chapterId++}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (err) {
      console.error(err.message);
      chapterId = 1;
      break;
    }
  }
}
getBibleDataByBook("Hebreus");
