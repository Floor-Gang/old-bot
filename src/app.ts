import { Bot } from "./core/Bot";


async function main() {
  try {
    const bot = new Bot();

    await bot.start();
  } catch (err) {
    console.log(err);
  }
}

main().catch(console.error);
