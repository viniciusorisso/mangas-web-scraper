import fs from 'fs';
import { normalizeMangaName } from '../utils.js';
import { Manga } from './classes/Manga.js';
import path from 'path';
import { fetchNewestMangas } from '../potusScraper.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUBSCRIBE_FILENAME = 'subscriptions.txt';
const NEWEST_FILENAME = 'newest.txt';

const filesPath = (filename) => path.resolve(__dirname,`./files/${filename}`);

/**
 * 
 * @param {String} mangaName 
 */
export const subscribeToAManga = async (mangaName) => {
  if (await mangaIsAlreadySubscribed(mangaName)) return;

  const buffer = fs.readFileSync(filesPath(SUBSCRIBE_FILENAME));
  const fileContent = buffer.toString();
  fs.writeFileSync(filesPath(SUBSCRIBE_FILENAME), fileContent + mangaName + '\n');
};

/**
 * @param {String} mangaName
 */
export const unsubscribeToAManga = async (mangaName) => {
  if (!await mangaIsAlreadySubscribed(mangaName)) return;

  const buffer = fs.readFileSync(filesPath(SUBSCRIBE_FILENAME));
  const fileContent = buffer.toString();
  fs.writeFileSync(filesPath(SUBSCRIBE_FILENAME), fileContent.replace(mangaName, ''));
};

/**
 * 
 * @returns {Array<String>}
 */
export const getMangasSubscribed = async () => {
  if(!fs.existsSync(filesPath(SUBSCRIBE_FILENAME)))
    fs.writeFileSync(filesPath(SUBSCRIBE_FILENAME), '');

  const buffer = fs.readFileSync(filesPath(SUBSCRIBE_FILENAME));
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

/**
 * 
 * @param {Array<Manga>} news 
 */
export const updateNewestMangas = (news) => {
  if(!fs.existsSync(filesPath(NEWEST_FILENAME)))
    fs.writeFileSync(filesPath(NEWEST_FILENAME), '');

  const parsedMangas = news.map(manga => {
    return `${manga.name}<-${manga.lastChapters.join(',')}#${manga.img};`
  }).join('\n');
  fs.writeFileSync(filesPath(NEWEST_FILENAME), parsedMangas);
}

/**
 * 
 * @returns 
 */
export const getNewestMangas = () => {
  if(!fs.existsSync(filesPath(NEWEST_FILENAME)))
    fs.writeFileSync(filesPath(NEWEST_FILENAME), '');

  const buffer = fs.readFileSync(filesPath(NEWEST_FILENAME));
  const fileContent = buffer.toString();

  const mangasArr = fileContent.split('\n').map(manga => {
    const img = manga.split('#')[1].replaceAll(';', '');

    const chapters = manga.split('#')[0].split('-')[1].split(',');
    
    const name = manga.split('<-')[0];

    return new Manga(name, chapters, img);
  })

  return mangasArr;
};

export const clearNewestMangas = () => {
  fs.unlinkSync(filesPath(NEWEST_FILENAME));
};