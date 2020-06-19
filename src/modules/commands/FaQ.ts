import { Command } from "../../core/models/Command";
import { Bot } from "../../core/Bot";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { Roles } from "../../util/Roles";


export class FaQ implements Command {
  public readonly name = 'faq';
  public readonly description = 'For adding another FaQ';
  private static readonly tag = "faq_channel";

  @Roles.isAdmin()
  public async handle(bot: Bot, msg: Message): Promise<void> {
    const args = msg.content.split(' ');

    switch (args[1]) {
      case 'add':
        await FaQ.add(bot, msg, args);
        break;
      case 'remove':
        await FaQ.remove(bot, msg, args);
        break;
      case 'list':
        await FaQ.list(bot, msg);
        break;
      case 'set':
        await FaQ.set(bot, msg);
        break;
    }
  }


  private static async add(bot: Bot, msg: Message, args: string[]) {
    if (!msg.guild) {
      await msg.reply("Use this command in a guild.");
      return;
    }
    // args = [faq, command, question ... answer]
    const client = bot.getClient();
    const store = bot.store.faq;
    const chanStore = bot.store.channels;
    const newLines = args.splice(2).join(' ').split('\n');
    const question = newLines[0];
    const answer = newLines.splice(1).join('\n');

    const faqChannelID = chanStore.getChannel(msg.guild.id, FaQ.tag);

    if (faqChannelID) {
      const channel = await client.channels.fetch(faqChannelID);

      if (channel && channel.type == "text") {
        const embed = FaQ.buildEmbed(question, answer);
        const txt = channel as TextChannel;
        store.addQuestion(msg.guild.id, question, answer);

        await txt.send({ embed });
      } else {
        await msg.reply("I can't see the currently set FaQ channel");
      }
    } else {
      await msg.reply("Please set an FaQ channel.");
    }
  }

  private static async remove(bot: Bot, msg: Message, args: string[]) {
    if (!msg.guild) {
      await msg.reply("Use this command in a guild.");
      return;
    }
    // args = [faq, command, question ... answer]
    const store = bot.store.faq;
    const newLines = args.splice(2).join(' ').split('\n');
    const question = newLines[0];

    const removed = store.remQuestion(msg.guild.id, question);

    if (removed)
      await msg.reply("Removed.");
    else
      await msg.reply("Failed to remove question. Did you type it properly?");
  }

  private static async set(bot: Bot, msg: Message) {
    const store = bot.store.channels;
    const channel = msg.mentions.channels.first();

    if (!channel) {
      await msg.reply(
        "Please mention the channel you'd like to set." +
        ` \`${bot.getConfig().bot.prefix} faq set #channel-name\``
      );
      return;
    }

    store.set(channel, FaQ.tag);
    await msg.reply("FaQ channel set.");
  }

  private static async list(bot: Bot, msg: Message) {
    if (!msg.guild) {
      await msg.reply("Use this command in a guild.");
      return;
    }
    const client = bot.getClient();
    const store = bot.store.channels;
    const faqChannelID = store.getChannel(msg.guild.id, FaQ.tag);

    if (faqChannelID) {
      const faqChannel = await client.channels.fetch(faqChannelID)

      if (faqChannel && faqChannel.type == "text") {
        const txt = faqChannel as TextChannel;
        await FaQ.sendAll(bot, txt);
      }

    } else {
      await msg.reply("Please set an FaQ channel.");
    }
  }

  private static buildEmbed(question: string, answer: string) {
    const embed = new MessageEmbed();
    embed.setColor(0x1385ef);
    embed.setTitle(question)
    embed.setDescription(answer);
    return embed;
  }

  private static async sendAll(bot: Bot, channel: TextChannel) {
    const store = bot.store.faq;
    const faqs = store.allQuestions(channel.guild.id);

    for (const faq of faqs) {
      const embed = FaQ.buildEmbed(faq.question, faq.answer);

      await channel.send({ embed });
    }
  }
}
