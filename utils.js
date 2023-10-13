/**
 * 
 * @param {String} manga 
 * @returns {String}
 */
export const normalizeMangaName = (manga) => manga.replace('/Manga/', '').replaceAll('_', ' ');