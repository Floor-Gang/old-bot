import { Bot } from "../../core/Bot";
import { Message, TextChannel, VoiceChannel } from "discord.js";
import { Command } from "../../core/models/Command";


export class LinkChannel implements Command {
  public readonly name = 'link';
  public readonly description = 'Link a voice channel and text channel' +
    ' together';

  public async handle(bot: Bot, msg: Message) {
    // args = [prefix, link, command, channel ID | voice ID, text ID | undefined]
    const args = msg.content.split(' ');

    switch (args[2]) {
      case 'create':
        const vc = args[3];
        const txt = msg.mentions.channels.first();

        if (vc && txt)
          await LinkChannel.create(bot, msg, vc, txt);
        else
          await LinkChannel.help(bot, msg);
        break;
      case 'remove':
        const channelID = args[3];
        if (channelID)
          await LinkChannel.remove(bot, msg, channelID);
        else
          await LinkChannel.help(bot, msg);
        break;
      case 'list':
        await LinkChannel.list(bot, msg);
        break;
      default:
        await LinkChannel.help(bot, msg);
        break;
    }
  }

  private static async create(bot: Bot, msg: Message, vc: string, txt: TextChannel) {
    const client = bot.getClient();
    const channel = await client.channels.fetch(vc);
    const store = bot.store.channelLink;

    if (channel && channel.type == 'voice') {
      const voice = channel as VoiceChannel;
      try {
        store.setLink(
          voice.id,
          txt.id
        );

        await msg.reply(`Linked "${voice.name}" and "${txt.name}"`);
      } catch (err) {
        await msg.reply("An error occurred. It's possible a provided" +
          " channel is already linked");
      }
    } else {
      await msg.reply("The provided voice channel isn't a voice channel or" +
        " I can't see it.");
    }
  }

  private static async remove(bot: Bot, msg: Message, channelID: string) {
    const store = bot.store.channelLink;
    const unlinked = store.unLink(channelID);

    if (unlinked)
      await msg.reply('Unlinked.');
    else
      await msg.reply("That channel isn't linked with anything.");
  }

  private static async help(bot: Bot, msg: Message) {
    const prefix = bot.getConfig().bot.prefix;
    await msg.reply(
      `Channel Link Commands:\n` +
      ` - ${prefix} link create <voice channel ID> <#text-channel>\n` +
      ` - ${prefix} link remove <voice channel ID or text channel ID>\n` +
      ` - ${prefix} link list`
    )
  }

  private static async list(bot: Bot, msg: Message) {
    const links = bot.store.channelLink.getAll();
    const client = bot.getClient();
    let linkedChannels = "**Linked Channels**\n";

    if (!links || links.length == 0) {
      await msg.reply("No channel links set.");
      return;
    }

    for (const [voice, text] of links) {
      const textChannel = await client.channels.fetch(text);
      const voiceChannel = await client.channels.fetch(voice);
      let linkage = ' - ';

      if (voiceChannel && voiceChannel.type == 'voice') {
        const vc = voiceChannel as VoiceChannel;
        linkage += `"${vc.name}" -> `;
      } else
        linkage += `unknown -> `;

      if (textChannel && textChannel.type == 'text') {
        const txt = textChannel as TextChannel;
        linkage += `<#${txt.id}>\n`;
      } else
        linkage += `unknown\n`;

      linkedChannels += linkage;
    }

    await msg.reply(linkedChannels);
  }
}
