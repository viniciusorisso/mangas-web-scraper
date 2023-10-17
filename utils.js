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