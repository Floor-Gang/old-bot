import { Command } from "../../core/models/Command";
import {
  GuildMember,
  Message,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import { Bot } from "../../core/Bot";
import { Roles } from "../../util/Roles";
import { NickDecision } from "../preprocessors/NickDecision";

export class Nick implements Command {
  public readonly name = "nick";
  public readonly description = "Nickname management";
  private static readonly regex = new RegExp(/^[\x00-\x7F]*$/);
  private static readonly tag = "nick_channel";

  public async handle(bot: Bot, msg: Message) {
    // args = [prefix, nick, command]
    const args = msg.content.split(' ');

    switch (args[2]) {
      case 'set':
        await Nick.set(bot, msg);
        break;
      case 'request':
        await Nick.request(bot, msg, args);
        break;
      default:
        await Nick.help(bot, msg);
        break;
    }
  }

  /**
   * This is the set command
   */
  @Roles.isAdmin()
  private static async set(bot: Bot, msg: Message) {
    const store = bot.store.channels;
    const target = msg.mentions.channels.first();

    if (target && target.type == 'text') {
      const txt = target as TextChannel;
      try {
        store.addChannel(txt, Nick.tag);
        await msg.reply('Set.');
      } catch (err) {
        store.updateChannel(txt, Nick.tag);
        await msg.reply('Set.');
      }
    }
  }

  /**
   * This is the request command
   * @param bot
   * @param msg
   * @param args
   */
  private static async request(bot: Bot, msg: Message, args: string[]) {
    if (!msg.member) {
      await msg.reply("Please use this command in a guild.");
      return;
    }

    const store = bot.store.nicks;
    const name = args.splice(3).join(' ');
    const illegalChars = Nick.getIllegal(name);

    // Check if they provided a valid nickname
    if (illegalChars.length > 0) {
      let response = 'Illegal characters: ';

      for (const char of illegalChars) {
        let i = illegalChars.indexOf(char);
        if (i == illegalChars.length - 1)
          response += `${char}.`;
        else
          response += `${char}, `;
      }
      await msg.reply(response);
      return;
    }

    // Make sure they don't already have a request
    const hasReq = store.hasReq(msg.author.id);
    if (hasReq) {
      await msg.reply("You already have a nickname request");
      return;
    }

    // Finally make the request
    try {
      await this.newRequest(bot, msg.member, name);
      await msg.reply("Request sent.")
    } catch (err) {
      await msg.reply("Something went wrong.");
      throw err;
    }
  }

  private static async newReqEmbed(channel: TextChannel, member: GuildMember, name: string): Promise<Message> {
    const embed = new MessageEmbed();
    embed.setTitle("Nickname Request");
    embed.setDescription(
      `I would like to set my nickname to "${name}"`
    );
    embed.setColor("GREEN");
    embed.setAuthor(
      `${member.displayName} (${member.user.username}#${member.user.discriminator})`,
      member.user.avatarURL() || ''
    );
    embed.setTimestamp(Date.now());
    const message = await channel.send({ embed });

    await message.react(NickDecision.allow);
    await message.react(NickDecision.deny)

    return message;
  }

  private static async help(bot: Bot, msg: Message) {
    const prefix = bot.getConfig().bot.prefix;
    await msg.reply(
      `Nickname Management Commands:\n` +
      ` - ${prefix} nick request <nickname> Request a new nickname\n` +
      ` - ${prefix} nick set #channel-name Set the channel where requests appear`
    )
  }

  private static async newRequest(bot: Bot, member: GuildMember, name: string) {
    const client = bot.getClient();
    const nickStore = bot.store.nicks;
    const chanStore = bot.store.channels;
    const nickChannelID = chanStore.getChannel(
      member.guild.id,
      Nick.tag
    );

    if (nickChannelID) {
      const nickChannel = await client.channels.fetch(nickChannelID || '');

      if (nickChannel && nickChannel.type == "text") {
        const txt = nickChannel as TextChannel;
        const newRequest = await Nick.newReqEmbed(
          txt, member, name
        );

        nickStore.addReq(
          member,
          name,
          newRequest.id
        );
      } else {
        throw new Error("Missing nickname requests channel, contact an admin.")
      }

    } else {
      throw new Error("Missing nickname requests channel, contact an admin.");
    }
  }

  private static getIllegal(name: string): string[] {
    const illegal: string[] = [];

    for (const char of name) {
      if (!Nick.regex.test(char))
        illegal.push(char);
    }

    return illegal;
  }
}
