import { normalizeMangaName } from "../../utils.js";

export class Manga {
  name;
  lastChapters;

  constructor(name, lastChapters, img) {
    this.name = normalizeMangaName(name);
    this.lastChapters = lastChapters;
    this.img = img;
  }
  
  get url() {
    return `${process.env.BASE_URL + '/Read1_' + this.nameToUrl()}`;
  }

  chapterUrl(chapter) {
    return this.url + '_' + chapter;
  }

  nameToUrl() {
    return this.name.split(' ').join('_');
  }
}