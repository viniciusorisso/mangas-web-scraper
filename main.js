import { Telegraf } from "telegraf";
import { fetchNewestMangas } from "./potusScraper.js";
import { generateMangaMenu, selectedMangaMenu } from "./utils.js";
import { updateNewestMangas, clearNewestMangas, subscribeToAManga, unsubscribeToAManga } from "./bd/interface.js";
import { getNewestMangas } from "./bd/interface.js";
import { verifyNewestMangas } from "./comparison.js";

const bot = new Telegraf(process.env.TELEGRAM_TOKEN_API);
let  threadId = '';

// trigger first fetch mangas
(async() => {
  await clearNewestMangas();
  const news = await fetchNewestMangas();
  await updateNewestMangas(news)
})();

bot.start((ctx) => ctx.reply('Hello, type "\/help" to see more info commands\n'));

bot.command('setgroup', async (ctx) => {
  console.log(ctx.message);
  const topic = ctx.message.is_topic_message ? ctx.message.message_thread_id : undefined;
  threadId = topic;
});

bot.command('subscribe', async (ctx) => { 
  await subscribeToAManga(ctx.payload);
  ctx.reply(`Manga ${ctx.payload} added in watch list.`);
});

bot.command('today', async (ctx) => {
  const news = await getNewestMangas();
  updateNewestMangas(news);
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
  ctx.reply(`Manga ${ctx.payload} removed in watch list.`);
});

bot.action(/Manga-+/, async (ctx) => {
  let mangaId = ctx.match.input.substring(6);

  const news = await getNewestMangas();
  const mangaMenu = selectedMangaMenu(news[mangaId]);

  ctx.deleteMessage();
  await ctx.replyWithPhoto({url: news[mangaId].img});
  await ctx.sendMessage(news[mangaId].name,{ 
    reply_markup: {
      inline_keyboard: [
        mangaMenu,
        [{ text: 'Back to full list', callback_data: 'render-full-menu'}],
        [{ text: 'Back to subscribed list', callback_data: 'render-subscribed-menu'}],
        [{ text: 'Close menu', callback_data: 'close-menu'}],
      ],
    }
  });
});

bot.action('render-full-menu', async (ctx) => {
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


bot.action('render-subscribed-menu', async (ctx) => {
  let res = await ctx.reply('Loading...');
  let i = res.message_id;
  await ctx.telegram.deleteMessage(ctx.chat.id, i);
  await ctx.telegram.deleteMessage(ctx.chat.id, i-1);
  await ctx.telegram.deleteMessage(ctx.chat.id, i-2);

  const updated = await verifyNewestMangas();
  const replyMenu = generateMangaMenu(updated);
  ctx.sendMessage('New Mangas Released Today', replyMenu);
});

bot.action('close-menu', async (ctx) => {
  let res = await ctx.reply('Closing...');
  try {
    let i = res.message_id;
    await ctx.telegram.deleteMessage(ctx.chat.id, i);
    await ctx.telegram.deleteMessage(ctx.chat.id, i-1);
    await ctx.telegram.deleteMessage(ctx.chat.id, i-2);
  } catch (error) {
  }
});

bot.launch();

/**
 * @constant intervalTime
 * @description 3h in MS
 */
const intervalTime = 10800000;

setInterval(async () => {
  const news = await fetchNewestMangas();
  updateNewestMangas(news);

  const currentTime = new Date();
  console.log(`FETCH NEWEST MANGAS: ${currentTime}`);

  const updated = await verifyNewestMangas();
  if(updated.length === 0) {
    bot.telegram.sendMessage(-1002122977632, 'Nenhum mangá atualizado');
  }
  else {
    const replyMenu = generateMangaMenu(updated);
    bot.telegram.sendMessage(-1002122977632,'Subscribed Updated Today', replyMenu);
  }
}, intervalTime);