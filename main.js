import { Telegraf } from "telegraf";
import { fetchNewestMangas } from "./potusScraper.js";
import { generateMangaMenu, selectedMangaMenu, normalizeMangaName } from "./utils.js";
import { updateNewestMangas } from "./bd/interface.js";
import { getNewestMangas } from "./bd/interface.js";

const bot = new Telegraf(process.env.TELEGRAM_TOKEN_API);

bot.start((ctx) => ctx.reply('Hello, type "\/help" to see more info commands\n'));

/*bot.command('subscribe', async (ctx) => { 
  await subscribeToAManga(ctx.payload);
});*/

bot.command('today', async (ctx) => {
  //const news = await fetchNewestMangas();
  const news = await getNewestMangas();
  updateNewestMangas(news);
  const replyMenu = generateMangaMenu(news);
  ctx.sendMessage('New Mangas Released Today', replyMenu);
})

/*bot.command('updated', async (ctx) => {
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
});*/

bot.action(/Manga-+/, async (ctx) => {
  let mangaId = ctx.match.input.substring(6);

  const news = await getNewestMangas();
  const mangaMenu = selectedMangaMenu(news[mangaId]);

  ctx.deleteMessage();
  await ctx.replyWithPhoto({url: news[mangaId].img});
  await ctx.sendMessage(normalizeMangaName(news[mangaId].name),{ 
    reply_markup: {
      inline_keyboard: [
        mangaMenu,
        [{ text: 'Back', callback_data: 'render-menu'}]
      ],
    }
  });
});

bot.action('render-menu', async (ctx) => {
  let res = await ctx.reply('Loading...');
  let i = res.message_id;
  await ctx.telegram.deleteMessage(ctx.chat.id, i);
  await ctx.telegram.deleteMessage(ctx.chat.id, i-1);
  await ctx.telegram.deleteMessage(ctx.chat.id, i-2);

  const news = await getNewestMangas();
  updateNewestMangas(news);
  const replyMenu = generateMangaMenu(news);
  ctx.sendMessage('New Mangas Released Today', replyMenu);
});



bot.launch();
