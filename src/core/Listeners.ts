import {
  Message,
  MessageReaction,
  PartialMessage, PartialUser, User,
  VoiceState,
  MessageEmbed,
  TextChannel
} from "discord.js";
import { preprocessors } from "../modules/preprocessors";
import { commands } from "../modules/commands";
import { Bot } from "./Bot";
import { v1 as uuid } from "uuid";


/**
 * All event channels are managed here. Each event channel name has a
 * method prefixed with "on" as an example the "message" callback method is
 * called "onMessage". If there is an event channel missing free to add it
 * by assigned a listener in the start method and creating a separate
 * method that handles the given event channel.
 */
export class Listeners {
  private readonly preprocessors = preprocessors;
  private readonly commands = commands;
  private readonly prefix: string;
  private help: string | null;

  constructor(private readonly bot: Bot, prefix: string) {
    this.prefix = prefix;
    this.help = null;
  }

  /**
   * This creates all the event channel listeners.
   */
  public start() {
    const client = this.bot.getClient();

    // Messages
    client.on('message', this.onMessage.bind(this));
    client.on('messageUpdate', this.onMessageUpdate.bind(this));
    client.on('voiceStateUpdate', this.onVoiceStateUpdate.bind(this));
    client.on('messageReactionAdd', this.onReaction.bind(this));

    // Client
    client.on('ready', this.onReady.bind(this));
    client.on('error', console.error);
  }

  /**
   * Discord client "ready" event channel callback method
   * @link https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-ready
   */
  private onReady() {
    const client = this.bot.getClient();
    console.log(`Ready as ${client?.user?.username}`);
  }

  /**
   * Discord client "messageUpdate" event channel callback method
   * @link https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageUpdate
   */
  private async onMessageUpdate(_: any, updated: Message | PartialMessage) {
    if (updated instanceof Message)
      await this.process<Message>('message', updated);
  }

  /**
   * Discord client "messageUpdate" event channel callback method
   * @link https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageUpdate
   */
  private async onVoiceStateUpdate(old: VoiceState, updated: VoiceState) {
    await this.process<VoiceState>('voiceStateUpdate', old, updated);
  }

  private async onReaction(reaction: MessageReaction, user: User | PartialUser) {
    await this.process<MessageReaction>('messageReactionAdd', reaction, user);
  }

  /**
   * Discord client "message" event channel callback method
   * @link https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-message
   */
  private async onMessage(message: Message) {
    const msg = await this.process<Message>('message', message);
    if (msg == null)
      return;

    if (msg.content.match(/(dylan\s?|\s?dev\s?(elopers?|)\s?|floor(\s?|\W)(g?a?n?g?\s?bot))/g) && 
    msg.member?.roles.cache.find(r => r.name in ["Admin", "Discord Mod", "Developer", "Senior Developer", "Sive", "PewDiePie"]) ) {
      const client = this.bot.getClient();
      const mention_ch = client.channels.cache.get("721477749440643112") as TextChannel;

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
          { name: "Message:", value: message.cleanContent, inline: false }
        )
        .setTimestamp();

      mention_ch.send(embed);

    }

    if (msg.content.startsWith(this.prefix)) {
      const i = message.content.indexOf(' ');
      const commandName = message.content.substr(
        this.prefix.length,
        i > -1 ? i - 1 : undefined
      );

      const executed = await this.onCommand(commandName, msg);
      if (!executed && msg.content.includes('help')) {
        const help = this.getHelp();
        await msg.reply(help);
      }
    }
  }

  /**
   * This returns the list of commands and their description if they have one.
   */
  private getHelp(): string {
    if (this.help != null)
      return this.help;

    let help = "**Available Commands**\n";
    for (const command of this.commands) {
      help += ` **${this.prefix}${command.name}** ${command.description || ''}\n`;
    }

    this.help = help;

    return help;
  }

  /**
   * After passing through the onMessage method if the message is trying to
   * reach the bot's commands it is then emitted here.
   * @param {string} name Command name being called
   * @param {Message} msg Message to respond to
   * @returns {Promise<boolean>}
   */
  private async onCommand(name: string, msg: Message): Promise<boolean> {
    for (const command of this.commands) {
      if (command.name == name) {
        const id = uuid().split('-')[0];
        const time = Date.now();
        console.log(
          `[${id}] [${time}] Command Executed\n` +
          ` - User: ${msg.author.username}#${msg.author.discriminator}\n` +
          ` - Command: ${msg.content}`
        );
        try {
          await command.handle(this.bot, msg);
        } catch (err) {
          console.error(
            `[${id}] [${Date.now()}] Command Error\n` +
            ` - User: ${msg.author.username}#${msg.author.discriminator}\n` +
            ` - Command: ${msg.content}\n` +
            ` - Error:`, err
          );
        }

        return true;
      }
    }
    return false;
  }

  /**
   * This communicates with preprocessors
   * @param {string} name Event channel name
   * @param {any[]} obj Rest parameters reserved for what a given event
   * channel provides
   * @returns {Promise<T | null>}
   */
  private async process<T>(name: string, ...obj: any[]): Promise<T | null> {
    let result: any | null = null;

    for (const preprocessor of this.preprocessors) {
      if (name == preprocessor.name) {
        const id = uuid();
        try {
          result = await preprocessor.process(this.bot, obj);
          if (result == null)
            break;
        } catch (err) {
          console.error(
            `[${id}] Preprocessor Error\n` +
            ` - Event Name: ${name}\n` +
            ` - Error:`, err
          );
        }

      }
    }
    return result;
  }
}
