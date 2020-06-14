import { Client } from "discord.js";
import { Listeners } from "./Listeners";


export type BotConfig = {
  prefix: string;
}

/**
 * This is the Bot class, it interfaces with Discord all event channels are
 * listened for in the Listeners class.
 */
export class Bot {
  private readonly client: Client;
  private readonly listeners: Listeners;

  constructor(config: BotConfig) {
    this.client = new Client();
    this.listeners = new Listeners(this, config.prefix);
  }

  public async start(token: string): Promise<void> {
    this.listeners.start();

    await this.client.login(token);
  }

  // public getConfig(): void {}

  public getClient(): Client { return this.client; }
}
