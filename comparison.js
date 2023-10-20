import { getMangasSubscribed } from "./bd/interface.js";
import { getNewestMangas } from "./bd/interface.js";

/**
 * 
 * @returns {Array<String>}
 */
export const verifyNewestMangas = async () => {
  const _subscribedMangas = await getMangasSubscribed();

  const newest = await getNewestMangas();
  const mangasUpdated = [];

  newest.forEach(manga => { 
    const found = _subscribedMangas.find(subs => manga.name.toLowerCase() === subs.toLowerCase() || subs.toLowerCase().includes(manga.name.toLowerCase()));

    if (found) mangasUpdated.push(manga);
  });

  return mangasUpdated;
};