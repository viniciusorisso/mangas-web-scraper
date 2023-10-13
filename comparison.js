import { getMangasSubscribed } from "./bd.js";
import { getNewestMangas } from "./potusScraper.js";
import { normalizeMangaName } from "./utils.js";

export const verifyNewestMangas = async () => {
  const _subscribedMangas = await getMangasSubscribed();

  const newest = await getNewestMangas();
  const mangasUpdated = [];

  newest.forEach(manga => { 
    const normalizedManga = normalizeMangaName(manga.name);
    const found = _subscribedMangas.find(subs => normalizedManga.toLowerCase() === subs.toLowerCase());

    if (found) mangasUpdated.push(normalizedManga);
  });

  return mangasUpdated;
};