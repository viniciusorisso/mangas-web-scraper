import { Manga } from "./bd/classes/Manga.js";

/**
 * 
 * @param {String} manga 
 * @returns {String}
 */
export const normalizeMangaName = (manga) => manga.replace('/Manga/', '').replaceAll('_', ' ');

/**
 * 
 * @param {{name: String, chapters: Array<String>>}}
 * @returns {String}
 */
export const normalizeTelegramMessage = ({name, chapters}) => {
  const normalizedName = normalizeMangaName(name);

  return normalizedName + '\n[ ' + chapters.map(chap => chap).join(' ,') + ' ]\n';
};

/**
 * 
 * @param {Array<{name: String, chapters: Array<String>}>} mangas 
 * @returns 
 */
export const generateMarkdownReply = (mangas) => { 
  const mangasMark = mangas.map(manga => {
    const chapterLinks = manga.chapters.map(chapter => {
      return `[${chapter}](${process.env.BASE_URL + manga.name.replace('/Manga/', '/Read1_') + '_' + chapter})`;
    });

    return `
      \\#\\# ${normalizeMangaName(manga.name)}:\n
      \\[ ${chapterLinks.join(', ')} \\]
    `;
  });

  return `
    \\# Novos Mangás\\!

    ${mangasMark}
  `;
};

/**
 * 
 * @param {Array<{name: String, chapters: Array<String>}>} mangas 
 */
export const generateMangaMenu = (mangas) => {
  const mangasMenu = [];
  const mangaMenuGenerator = menuGenerator(mangas);
  let current = mangaMenuGenerator.next();

  while(current.done === false) {
    mangasMenu.push(current.value)
    current = mangaMenuGenerator.next();
  }

  return {
    reply_markup: {
      inline_keyboard: [
        ...mangasMenu,
        [{ text: 'Close menu', callback_data: 'close-menu'}],
      ]
    }
  };
}

/**
 * 
 * @param {Array<{name: String, chapters: Array<String>}>} mangas 
 */
function* menuGenerator (mangas) {
  for (let i = 0; i < mangas.length ; i++) {
    const menu = [
      {
        text: normalizeMangaName(mangas[i].name),
        callback_data: `Manga-${i}`
      }
    ]

    yield menu;
  }
}

/**
 * 
 * @param {Manga} manga
 * @returns {Array<{text: string, url: string}>}
 */
export const selectedMangaMenu = (manga) => {
  const menu = [];
  manga.lastChapters.forEach(chap => {
    menu.push({
      text: chap,
      url: manga.chapterUrl(chap)
    })
  });

  return menu;
};