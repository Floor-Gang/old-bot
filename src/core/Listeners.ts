import { Message } from "discord.js";
import { preprocessors } from "../modules/preprocessors";
import { commands } from "../modules/commands";
import { Bot } from "./Bot";
import { PossibleMessage } from "./models/Shared";


export class Listeners {
  private readonly preprocessors = preprocessors;
  private readonly commands = commands;
  private readonly prefix: string;
  private help: string | null;

  constructor(private readonly bot: Bot, prefix: string) {
    this.prefix = prefix;
    this.help = null;
  }

  public start() {
    const client = this.bot.getClient();

    // Messages
    client.on('message', this.onMessage.bind(this));
    client.on('messageUpdate', this.onMessageUpdate.bind(this));

    // Client
    client.on('ready', this.onReady.bind(this));
  }

  private onReady() {
    const client = this.bot.getClient();
    console.log(`Ready as ${client?.user?.username}`);
  }

  private async onMessageUpdate(_: PossibleMessage, updated: PossibleMessage) {
    if (updated instanceof Message)
      await this.process<Message>('message', updated);
  }

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

  private getHelp(): string {
    if (this.help != null)
      return this.help;

    let help = "**Available Commands**\n";
    for (const command of this.commands) {
      help += ` **${this.prefix} ${command.name}** ${command.description}\n`;
    }

    this.help = help;

    return help;
  }

  private async onCommand(name: string, msg: Message): Promise<boolean> {
    for (const command of this.commands) {
      if (command.name == name) {
        await command.handle(this.bot, msg);
        return true;
      }
    }
    return false;
  }

  private async process<T>(name: string, ...obj: any[]): Promise<T | null> {
    let result: any | null = null;

    for (const preprocessor of this.preprocessors) {
      if (name == preprocessor.name) {
        result = await preprocessor.process(this.bot, obj);
        if (result == null)
          break;
      }
    }
    return result;
  }
}
