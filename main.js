import { subscribeToAManga, unsubscribeToAManga } from "./bd.js";
import { verifyNewestMangas } from "./comparison.js";
import { Telegraf } from "telegraf";
import { getNewestMangas } from "./potusScraper.js";
import { generateMarkdownReply } from "./utils.js";

const bot = new Telegraf(process.env.TELEGRAM_TOKEN_API);

bot.start((ctx) => ctx.reply('Hello, type "\/help" to see more info commands\n'));

bot.command('subscribe', async (ctx) => { 
  await subscribeToAManga(ctx.payload);
});

bot.command('today', async (ctx) => {
  const news = await getNewestMangas();
  const markdownText = generateMarkdownReply(news);
  ctx.replyWithMarkdownV2(String(markdownText));
})

bot.command('updated', async (ctx) => {
  const updated = await verifyNewestMangas();
  if(updated.length === 0) {
    ctx.reply('Nenhum mangá atualizado');
  }
  else {
    const markdownText = generateMarkdownReply(updated);
    ctx.replyWithMarkdownV2(String(markdownText));
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

bot.launch();
