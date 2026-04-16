import { prisma } from "../public/src/lib/prisma.js";

import { getBookSQL } from "../public/assets/js/scrapper/getBookSQL.js";
import { getVersesSQL } from "../public/assets/js/scrapper/getVersesSQL.js";

async function main() {
  // Create BKJ version
  // const version = await prisma.version.create({
  //   data: { id: 0, name: "Bíblia King James", abbrev: "bkj" },
  // });
  // Look for something
  // const versionName = await prisma.version.findFirst();
  // console.log("versionName:", versionName);
  // const testament = await prisma.testament.createMany({
  //   data: [
  //     { id: 0, name: "Velho Testamento" },
  //     { id: 1, name: "Novo Testamento" },
  //   ],
  // });
  // Create verses
  // const verses = await getVersesSQL();
  // const createVerses = await prisma.verse.createMany({
  //   data: verses,
  //   skipDuplicates: true,
  // });
  // console.log(createVerses);
  // Create books
  // const books = getBookSQL();
  // const insertBook = await prisma.book.createMany({ data: books, skipDuplicates: true });
  // console.log(insertBook);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
