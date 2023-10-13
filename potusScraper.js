import rp from 'request-promise';
const url = 'https://w15.mangafreak.net/'
import { load } from 'cheerio';

/**
 * 
 * @returns {Array<{name: String,chapter: String}>}
 */
export const getNewestMangas = async () => {
  let rawHtml = '';
  const newestMangas = [];
  
  try {
    const response = await rp(url);
    rawHtml = response;
  } catch (error) {
    
  }
  const $ = load(rawHtml, { decodeEntities: false });
  
  let current = $('.bar:contains("TODAY\'S MANGA")').next();
  let l = load(current.children()[0]);
  let s = l('.latest_item').toArray();
  let children = s.map(el => { 
    const filtered = el.children.filter(nodeEl => nodeEl.type !== 'text');
    return filtered;
  });
  
  children.forEach(el => {
    let name = '';
    let chapter = 0;
  
    el.forEach(div => {
      if(div.attribs.class === 'name') {
        name = div.attribs.href;
      }
      else if(div.attribs.class === 'chapter_box') {
        let child = div.children[1].children;
        chapter = child[0].data.split(' ')[1];
      }
    })
  
    newestMangas.push({
      name,
      chapter
    });
  });
  
  return newestMangas;
};