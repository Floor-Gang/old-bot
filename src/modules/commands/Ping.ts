import { Command } from "../../core/models/Command";
import { Message } from "discord.js";
import { Bot } from "../../core/Bot";


export class Ping implements Command {
  public readonly name = "ping";
  public readonly description = "For testing";

  public async handle(bot: Bot, msg: Message): Promise<void> {
    await msg.reply('Pong');
  }
}
