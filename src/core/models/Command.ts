import type { Message } from "discord.js";
import { Bot } from "../Bot";


/**
 * This represents a command it has a name and an optional description
 * which gets printed when !pewds help is called or they improperly called
 * a command name.
 */
export interface Command {
  name: string;
  description?: string;
  handle(bot: Bot, msg: Message): Promise<void>;
}
