import { Preprocessor } from "../../core/models/Preprocessor";
import { Message } from "discord.js";
import { Bot } from "../../core/Bot";
import { downVoteEmoji, upVoteEmoji } from "../../util/Shared";


export class Suggestions implements Preprocessor<Message> {
  private static readonly channel =  "720095191842947123";
  private static readonly upVote = upVoteEmoji;
  private static readonly downVote = downVoteEmoji;
  public readonly name = "message";

  public async process(bot: Bot, obj: Message[]): Promise<Message | null> {
    const msg = obj[0];


    if (msg.channel.id == Suggestions.channel) {
      await msg.react(Suggestions.upVote);
      await msg.react(Suggestions.downVote);
    }

    return msg;
  }

}
