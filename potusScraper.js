import got from 'got';
export const URL_BASE = process.env.BASE_URL;
import { load } from 'cheerio';
import { Manga } from './bd/classes/Manga.js';

/**
 * 
 * @returns {Array<{name: String,chapter: Array<String>}>}
 */
export const fetchNewestMangas = async () => {
  let rawHtml = '';
  const newestMangas = [];
  
  try {
    const response = await got(URL_BASE);
    rawHtml = response.body;
  } catch (error) {
    console.log(error);
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
    let chapters = [];
    let img = '';
  
    el.forEach(div => {
      if(div.attribs.class === 'name') {
        name = div.attribs.href;
      }
      else if(div.attribs.class === 'image') {
        img = div.children[0].attribs.src;
      }
      else if(div.attribs.class === 'chapter_box') {
        div.children.forEach(el => {
          if(el.name === 'a') {
            chapters.push(el.attribs.href.split('_').slice(-1)[0]);
          }
        });
      }
    })
  
    const manga = new Manga(name, chapters, img);
    newestMangas.push(manga);
  });
  

  return newestMangas.sort();
};