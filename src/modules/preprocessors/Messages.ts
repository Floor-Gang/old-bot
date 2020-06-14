import { Preprocessor } from "../../core/models/Preprocessor";
import { Message } from "discord.js";
import { Bot } from "../../core/Bot";
import { Censorship } from "../../util/Censorship";


export class Messages implements Preprocessor<Message> {
  public readonly name = 'message';

  public async process(bot: Bot, obj: Message[]): Promise<Message | null> {
    const msg = obj[0];
    const isNWord = Censorship.isNWord(msg.content);

    if (isNWord) {
      await msg.delete();
      return null;
    }

    return msg;
  }
}
