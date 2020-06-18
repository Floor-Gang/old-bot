import { Command } from "../../core/models/Command";
import { CategoryChannel, Message, VoiceChannel } from "discord.js";
import { Bot } from "../../core/Bot";
import { Roles } from "../../util/Roles";


export class Flux implements Command {
  public static readonly parents = 'flux-parent';
  public static readonly category = 'flux';
  public readonly name = 'flux';
  public readonly description = 'Make a category resizable';

  @Roles.isAdmin()
  public async handle(bot: Bot, msg: Message): Promise<void> {
    // args = [prefix, flux, command]
    const args = msg.content.split(' ');

    switch (args[2]) {
      case 'create':
        await Flux.create(bot, msg, args);
        break;
      case 'remove':
        await Flux.remove(bot, msg, args);
        break;
      case 'list':
        await Flux.list(bot, msg);
        break;
      default:
        await Flux.help(bot, msg);
        break;
    }
  }

  private static async create(bot: Bot, msg: Message, args: string[]) {
    const client = bot.getClient();
    const store = bot.store.tags;
    const categoryID = args[3];

    if (!categoryID) {
      await Flux.help(bot, msg);
      return;
    }

    const channel = await client.channels.fetch(categoryID);
    if (channel && channel.type == "category") {
      const category = channel as CategoryChannel;
      const has = store.has(Flux.category, category.id);

      if (has) {
        await msg.reply("This channel is already set.");
      } else {
        const result = Flux.newFlux(bot, category);
        await msg.reply(result);
      }
    } else {
      await msg.reply("An invalid category ID was provided, or I can't see" +
        " it");
    }
  }

  private static newFlux(bot: Bot, category: CategoryChannel): string {
    const store = bot.store.tags;
    let result = `Added "${category.name}".\nDefault Channels:\n`

    store.setID(Flux.category, category.id);
    for (const channel of category.children.values()) {
      if (channel.type == 'voice') {
        const vc = channel as VoiceChannel;
        store.setID(Flux.parents, vc.id);
        result += ` - ${vc.name}\n`;
      }
    }

    return result;
  }

  private static removeFlux(bot: Bot, category: CategoryChannel): string {
    const store = bot.store.tags;
    let result = `Removed "${category.name}".\\nDefault Channels:\n`;


    store.remove(Flux.category, category.id);
    for (const channel of category.children.values()) {
      if (channel.type == 'voice') {
        const vc = channel as VoiceChannel;
        store.remove(Flux.parents, vc.id);
        result += ` - ${vc.name}\n`;
      }
    }

    return result;
  }

  private static async help(bot: Bot, msg: Message) {
    const prefix = bot.getConfig().bot.prefix;
    await msg.reply(
      `Flux Commands:\n` +
      ` - ${prefix} flux create <category ID>\n` +
      ` - ${prefix} flux remove <category ID>\n` +
      ` - ${prefix} flux list`
    );
  }

  private static async remove(bot: Bot, msg: Message, args: string[]) {
    const client = bot.getClient();
    const categoryID = args[3];

    if (!categoryID) {
      await Flux.help(bot, msg);
      return;
    }

    const channel = await client.channels.fetch(categoryID);

    if (channel && channel.type == "category") {
      const category = channel as CategoryChannel;

      this.removeFlux(bot, category);
    } else {
      await msg.reply("An invalid category ID was provided, or I can't see" +
        " it");
    }
  }

  private static async list(bot: Bot, msg: Message) {
    const client = bot.getClient();
    const store = bot.store.tags;
    const channels = store.getAllIDs(Flux.category);
    let list = 'Fluctuating Channels:\n';

    if (!channels) {
      await msg.reply("No fluctuating channels.");
      return;
    }

    for (const channelID of channels) {
      const channel = await client.channels.fetch(channelID);

      if (channel && channel.type == "category") {
        const category = channel as CategoryChannel;
        list += ` - ${category.name}\n`;
      } else {
        list += ` - <unknown> (${channelID})\n`;
      }
    }

    await msg.reply(list);
  }
}
