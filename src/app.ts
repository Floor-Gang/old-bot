import { Bot } from "./core/Bot";


const config = {
  bot: {
    prefix: '!pewds'
  }
}

async function main() {
  try {
    const bot = new Bot(config.bot);
    const token = process.env['TOKEN'];

    await bot.start(token || '');
  } catch (err) {
    console.log("Something went wrong while logging in, was a proper token" +
                " provided?");
  }
}

main().catch(console.error);
