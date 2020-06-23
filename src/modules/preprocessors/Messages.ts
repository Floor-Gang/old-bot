import { Preprocessor } from "../../core/models/Preprocessor";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { Bot } from "../../core/Bot";
import { Censorship } from "../../util/Censorship";
import { Roles } from "../../util/Roles";

/**
 * This is the Message preprocessor. It does the following:
 * * Utilize the Censorship class to see if the give message should be deleted
 */
export class Messages implements Preprocessor<Message> {
  public readonly name = 'message';

  public async process(bot: Bot, obj: Message[]): Promise<Message | null> {
    const msg = obj[0];
    const isNWord = Censorship.hasNWord(msg.content);

    /**
     * Detects conversation between mods about the floorgang bot.
     * Mentions this in the developer server.
     */
    const matches = msg.content.match(/(dylan\s?\W|\s?dev\s?(elopers?|elopment|)\s?\W|floor(\s?|\W)(g?a?n?g?\s?bot))/g);
    if (matches && msg.member) {
      const hasRole = msg.member.roles.cache.find(r => bot.getConfig().bot.roles_can_mention.includes(r.id))
      if (hasRole) {
        const client = bot.getClient();
        const mention_ch = client.channels.cache.get(bot.getConfig().bot.mention_ch) as TextChannel;

        const embed = new MessageEmbed()
          .setColor(0xff0000)
          .addFields(
            { name: "Server:", value: msg.guild?.name, inline: true },
            { name: "Channel:", value: `<#${msg.channel.id}>`, inline: true },
            { name: "Author:", value: msg.author, inline: true },
            { name: "Time (UTC):", value: msg.createdAt, inline: true },
            { name: "Message Link:", value: msg.url },
            { name: "Message:", value: msg.cleanContent, inline: false }
          )
          .setAuthor(`${msg.author.username} said`)
          .setTimestamp();

        await mention_ch.send(embed);
      }
    }

    if (msg.member) {
      const adminRoles = bot.getConfig().bot.admin_roles
      const isAdmin = Roles.hasRole(
        msg.member.roles.cache.array(),
        adminRoles
      );

      if (isAdmin)
        return obj[0];
    }


    if (isNWord) {
      await msg.delete();
      return null;
    }

    return msg;
  }
}
