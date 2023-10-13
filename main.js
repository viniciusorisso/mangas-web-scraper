import { verifyNewestMangas } from "./comparison.js";

const news = await verifyNewestMangas();

console.log(news);
