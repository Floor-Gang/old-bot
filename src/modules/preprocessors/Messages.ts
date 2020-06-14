import { Preprocessor } from "../../core/models/Preprocessor";
import { Message } from "discord.js";
import { Bot } from "../../core/Bot";
import { Censorship } from "../../util/Censorship";

/**
 * This is the Message preprocessor. It does the following:
 * * Utilize the Censorship class to see if the give message should be deleted
 */
export class Messages implements Preprocessor<Message> {
  public readonly name = 'message';

  public async process(bot: Bot, obj: Message[]): Promise<Message | null> {
    const msg = obj[0];
    const isNWord = Censorship.hasNWord(msg.content);

    if (isNWord) {
      await msg.delete();
      return null;
    }

    return msg;
  }
}
