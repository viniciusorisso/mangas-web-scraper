import { subscribeToAManga, unsubscribeToAManga } from "./bd.js";
import { verifyNewestMangas } from "./comparison.js";
import { Telegraf } from "telegraf";
import { getNewestMangas } from "./potusScraper.js";
import { generateMangaMenu, selectedMangaMenu, normalizeMangaName } from "./utils.js";

const bot = new Telegraf(process.env.TELEGRAM_TOKEN_API);

bot.start((ctx) => ctx.reply('Hello, type "\/help" to see more info commands\n'));

bot.command('subscribe', async (ctx) => { 
  await subscribeToAManga(ctx.payload);
});

bot.command('today', async (ctx) => {
  const news = await getNewestMangas();
  const replyMenu = generateMangaMenu(news);
  ctx.sendMessage('New Mangas Released Today', replyMenu);
})

bot.command('updated', async (ctx) => {
  const updated = await verifyNewestMangas();
  if(updated.length === 0) {
    ctx.reply('Nenhum mangá atualizado');
  }
  else {
    const replyMenu = generateMangaMenu(updated);
    ctx.sendMessage('Subscribed Updated Today', replyMenu);
  }
});

bot.command('help', (ctx) => {
  ctx.reply(
    '/today -> shows today released mangas\n/updated -> shows if subscribed mangas was released\n/subscribe -> put manga name to be watched in updated command'
  )
});

bot.command('unsubscribe', async (ctx) => {
  await unsubscribeToAManga(ctx.payload);
});

bot.action(/Manga-+/, async (ctx) => {
  let mangaId = ctx.match.input.substring(6);

  const news = await getNewestMangas();
  const mangaMenu = selectedMangaMenu(news[mangaId]);

  ctx.deleteMessage();
  ctx.sendMessage(normalizeMangaName(news[mangaId].name), { 
    reply_markup: {
      inline_keyboard: [
        mangaMenu
      ]
    }
  });
  console.log(mangaId);
});

bot.launch();
