import { subscribeToAManga } from "./bd.js";
import { verifyNewestMangas } from "./comparison.js";
import { Telegraf } from "telegraf";
import { getNewestMangas } from "./potusScraper.js";
import { normalizeMangaName } from "./utils.js";

const bot = new Telegraf();

bot.start((ctx) => ctx.reply('Alou, digite "subscribe nome-do-manga" para inscrever um manga para ser observado'));
bot.command('subscribe', async (ctx) => { 
  await subscribeToAManga(ctx.payload);
});
bot.command('today', async (ctx) => {
  const news = await getNewestMangas();
  ctx.reply(news.map(el => normalizeMangaName(el.name)).join('\n'));
})
bot.command('updated', async (ctx) => {
  const updated = await verifyNewestMangas();
  ctx.reply(updated.join('\n') || 'Nenhum mangá atualizado');
});

bot.launch();
