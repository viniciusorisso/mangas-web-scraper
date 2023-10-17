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

  const buffer = fs.readFileSync(filename);
  const fileContent = buffer.toString();
  fs.writeFileSync(filename, fileContent + normalizedManga + '\n');
};

/**
 * @param {String} mangaName
 */
export const unsubscribeToAManga = async (mangaName) => {
  const normalizedManga = normalizeMangaName(mangaName);

  if (!await mangaIsAlreadySubscribed(normalizeMangaName)) return;

  const buffer = fs.readFileSync(filename);
  const fileContent = buffer.toString();
  fs.writeFileSync(filename, fileContent.replace(normalizedManga, ''));
};

/**
 * 
 * @returns {Array<String>}
 */
export const getMangasSubscribed = async () => {
  if(!fs.existsSync(filename))
    fs.writeFileSync(filename, '');

  const buffer = fs.readFileSync(filename);
  const fileContent = buffer.toString();

  return fileContent.split('\n');
}

/**
 * 
 * @param {String} mangaName 
 * @returns {Boolean}
 */
const mangaIsAlreadySubscribed = async (mangaName) => {
  const allMangas = await getMangasSubscribed();

  return !!allMangas.find(manga => manga.toLocaleLowerCase().includes(mangaName.toLocaleLowerCase()));
}

