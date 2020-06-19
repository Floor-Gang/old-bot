import {
  Client,
  FileOptions, Message,
  TextChannel, User
} from "discord.js";
import { Listeners } from "./Listeners";
import { Config } from "./Config";
import { Store } from "./Store";


/**
 * This is the Bot class, it interfaces with Discord all event tags are
 * listened for in the Listeners class.
 */
export class Bot {
  private static readonly characterLimit = 2000;
  private readonly client: Client;
  private readonly listeners: Listeners;
  public readonly store: Store;
  private config: Config;

  constructor() {
    this.config = Config.getConfig();
    this.client = new Client();
    this.listeners = new Listeners(this, this.config.bot.prefix);
    this.store = new Store();
  }

  /**
   * This starts the whole bot
   */
  public async start(): Promise<void> {
    this.listeners.start();

    await this.client.login(this.config.bot.token);
  }

  /**
   * This method sends a message to a text channel, and if the body of the
   * message is too long it sends it in a file
   * @param channel Channel to send to
   * @param context The body of the message to send
   * @param reply [Optional] mention a given user
   */
  public async send(channel: TextChannel, context: string, reply?: User): Promise<Message> {
    if (context.length >= Bot.characterLimit) {
      const attachment: FileOptions = {
        name: 'message.txt',
        attachment: Buffer.from(context)
      };
      return channel.send({
        files: [attachment],
        reply
      });
    } else {
      return channel.send(context, { reply });
    }
  }

  /**
   * This gets the current config
   */
  public getConfig(): Config {
    return this.config;
  }

  /**
   * This saves a given config and overwrites the current config file
   */
  public setConfig(config: Config): void {
    this.config = config;
    Config.store(config);
  }

  /**
   * This gets the Discord client
   */
  public getClient(): Client { return this.client; }
}
