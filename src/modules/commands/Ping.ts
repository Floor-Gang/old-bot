import { Command } from "../../core/models/Command";
import { Message } from "discord.js";
import { Bot } from "../../core/Bot";


/**
 * Ping command
 */
export class Ping implements Command {
  public readonly name = "ping";
  public readonly description = "For testing";

  public async handle(bot: Bot, msg: Message): Promise<void> {
    const message = await msg.reply('Pong');
    await message.edit(
      `Pong ${message.createdTimestamp - msg.createdTimestamp}ms`
    );
  }
}
