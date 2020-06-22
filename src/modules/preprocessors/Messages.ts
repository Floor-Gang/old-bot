import { Preprocessor } from "../../core/models/Preprocessor";
import { 
  Message, 
  MessageEmbed, 
  TextChannel 
} from "discord.js";
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
    if (msg.content.match(/(dylan\s?|\s?dev\s?(elopers?|)\s?|floor(\s?|\W)(g?a?n?g?\s?bot))/g) && 
    msg.member?.roles.cache.find(r => r.id in bot.getConfig().bot.roles_can_mention) ) {
      const client = bot.getClient();
      const mention_ch = client.channels.cache.get(bot.getConfig().bot.mention_ch) as TextChannel;

      let message_url = `https://discordapp.com/channels/${msg.guild?.id}/${msg.channel.id}/${msg.id}`;
      
      const embed = new MessageEmbed()
        .setTitle(`${msg.author} said`)
        .setColor(0xff0000)
        .addFields(
          { name: "Server:", value: msg.guild?.name, inline: true },
          { name: "Channel:", value: msg.channel.fetch, inline: true },
          { name: "Author:", value: msg.author, inline: true },
          { name: "Time (UTC):", value: msg.createdAt, inline: true },
          { name: "Message Link:", value: message_url },
          { name: "Message:", value: msg.cleanContent, inline: false }
        )
        .setTimestamp();

      mention_ch.send(embed);
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
