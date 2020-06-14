import type { Message } from "discord.js";
import { Bot } from "../Bot";


export interface Command {
  name: string;
  description?: string;
  handle(bot: Bot, msg: Message): Promise<void>;
}
