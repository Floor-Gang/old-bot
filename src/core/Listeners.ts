import { Message, VoiceState } from "discord.js";
import { preprocessors } from "../modules/preprocessors";
import { commands } from "../modules/commands";
import { Bot } from "./Bot";
import { PossibleMessage } from "./models/Shared";
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
  private async onMessageUpdate(_: PossibleMessage, updated: PossibleMessage) {
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

  /**
   * Discord client "message" event channel callback method
   * @link https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-message
   */
  private async onMessage(message: Message) {
    const msg = await this.process<Message>('message', message);
    if (msg == null)
      return;


    if (msg.content.startsWith(this.prefix)) {
      // args = ["<bot prefix>", "commandName" || undefined]
      const args = msg.content.split(' ');
      const commandName = args[1];

      const executed = await this.onCommand(commandName, msg);
      if (!executed) {
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
      help += ` **${this.prefix} ${command.name}** ${command.description || ''}\n`;
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
        const id = uuid();
        console.log(
          `[${id}] Command Executed\n` +
          ` - User: ${msg.author.username}#${msg.author.discriminator}\n` +
          ` - Command: ${msg.content}`
        );
        try {
          await command.handle(this.bot, msg);
        } catch (err) {
          console.error(
            `[${id}] Command Error\n` +
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
