import { Command } from "../../core/models/Command";
import { Message, MessageEmbed } from "discord.js";
import { Bot } from "../../core/Bot";
import { Roles } from "../../util/Roles";
import { downVoteEmoji, upVoteEmoji } from "../../util/Shared";

export class Vote implements Command {
  public readonly name = "vote";
  public readonly description = "Start community votes";

  @Roles.isAdmin()
  public async handle(bot: Bot, msg: Message): Promise<void> {
    // args = [prefix, votes, command]
    const args = msg.content.split(' ');

    if (args[2] == 'create') {
      await Vote.create(msg, args);
    } else {
      await Vote.help(bot, msg);
    }
  }

  private static async create(msg: Message, args: string[]) {
    if (!msg.member)
      return;
    const embed = new MessageEmbed();
    const body = args.splice(3).join(' ');

    embed.setTitle("Community Vote");
    embed.setDescription(body);
    embed.setColor(0x5837d3);
    embed.setAuthor(
      msg.member.displayName,
      msg.author.avatarURL() || ''
    );
    embed.setTimestamp(Date.now());

    const message = await msg.channel.send({ embed });
    await message.react(upVoteEmoji);
    await message.react(downVoteEmoji);
    await message.pin();
    await msg.delete();
  }

  private static async help(bot: Bot, msg: Message) {
    const prefix = bot.getConfig().bot.prefix;

    await msg.reply(`${prefix} vote create <context>`);
  }
}
