import { getMangasSubscribed } from "./bd.js";
import { getNewestMangas } from "./potusScraper.js";
import { normalizeMangaName } from "./utils.js";

const _subscribedMangas = await getMangasSubscribed();

export const verifyNewestMangas = async () => {
  const newest = await getNewestMangas();
  const mangasUpdated = [];

  newest.forEach(manga => { 
    const normalizedManga = normalizeMangaName(manga.name);
    const found = _subscribedMangas.find(subs => normalizedManga.toLowerCase() === subs.toLowerCase());

    if (found) mangasUpdated.push(normalizedManga);
  });

  return mangasUpdated;
};