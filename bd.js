import fs from 'fs';
import { normalizeMangaName } from './utils.js';

const filename = 'subscriptions.txt';

/**
 * 
 * @param {String} mangaName 
 */
export const subscribeToAManga = async (mangaName) => {
  const normalizedManga = normalizeMangaName(mangaName);

  if (await mangaIsAlreadySubscribed(normalizedManga)) return;

  fs.writeFileSync(filename, normalizedManga + '\n');
};

/**
 * 
 * @returns {Array<String>}
 */
export const getMangasSubscribed = async () => {
  if(!fs.existsSync(filename))
    fs.writeFileSync(filename, '');

  const buffer = fs.readFileSync(filename);
  const fileContend = buffer.toString();

  return fileContend.split('\n');
}

/**
 * 
 * @param {String} mangaName 
 */
const mangaIsAlreadySubscribed = async (mangaName) => {
  const allMangas = await getMangasSubscribed();

  return !!allMangas.find(manga => manga.toLocaleLowerCase().includes(mangaName.toLocaleLowerCase()));
}