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
      case 'get':
        await FaQ.get(bot, msg, args);
        break;
      case 'set':
        await FaQ.set(bot, msg);
        break;
      case 'test':
        await FaQ.test(bot, msg.channel as TextChannel);
        break;
      default:
        await FaQ.help(bot, msg);
    }
  }

  private static async test(bot: Bot, channel: TextChannel) {
    await FaQ.sendAll(bot, channel);
  }

  private static async help(bot: Bot, msg: Message) {
    const prefix = bot.getConfig().bot.prefix;
    await msg.reply(
      `FaQ Commands:\n` +
      ` - ${prefix}faq add <question> NEWLINE <answer>\n` +
      ` - ${prefix}faq remove <question>\n` +
      ` - ${prefix}faq set #faq-channel\n` +
      ` - ${prefix}faq get <question context> Find the answer to a given question\n` +
      ` - ${prefix}faq list This will show all the embed FaQ`
    )
  }

  private static async get(bot: Bot, msg: Message, args: string[]) {
    if (!msg.guild) {
      await msg.reply("Use this command in a guild.");
      return;
    }
    const store = bot.store.faq;
    const faqs = store.allQuestions(msg.guild.id);
    // !faq, get, <question>
    const lookingFor = args.splice(2).join(' ').toLowerCase();
    let found: MessageEmbed | null = null;

    for (const faq of faqs) {
      let lowerQuestion = faq.question.toLowerCase();
      if (lowerQuestion.includes(lookingFor)) {
        found = FaQ.buildEmbed(faq.question, faq.answer);
        break;
      }
    }

    if (found)
      await msg.reply({ embed: found });
    else {
      await msg.reply(`Couldn't find any questions including "${lookingFor}"`);
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
        store.addQuestion(msg.guild.id, question.trim(), answer);

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
    const question = args.splice(2).join(' ');

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
