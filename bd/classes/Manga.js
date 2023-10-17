export class Manga {
  name;
  lastChapters;
  url;

  constructor(name, lastChapters, url) {
    this.name = name;
    this.lastChapters = lastChapters;
    this.url = url;
  }

  chapterUrl(chapter) {
    return this.url + '_' + chapter;
  }
}