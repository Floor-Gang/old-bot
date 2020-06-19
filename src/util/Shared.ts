import { Bot } from "../core/Bot";
import { Message } from "discord.js";

export const upVoteEmoji =   "718677992926347344";
export const downVoteEmoji = "718677670342426646";

export const botOnlyTag = 'bot_channel';

export function botsOnly() {
  return function(obj: Object, key: string, func: PropertyDescriptor) {
    const original = func.value;

    func.value = function(...args: any[]) {
      const bot: Bot = args[0];
      const msg: Message = args[1];
      const channel = msg.channel.id;
      const store = bot.store.channels;

      if (!msg.guild) {
        return null;
      }
      const botChannel = store.getChannel(msg.guild.id, botOnlyTag);

      if (!botChannel)
        return null;

      if (botChannel == channel) {
        original.apply(this, args);
      } else {
        msg.reply(`Use this command in <#${botChannel}>`)
      }
    }

  }
}
