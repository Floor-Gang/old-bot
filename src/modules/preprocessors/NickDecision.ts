import { Preprocessor } from "../../core/models/Preprocessor";
import { Message, MessageReaction, User } from "discord.js";
import { Bot } from "../../core/Bot";
import { downVoteEmoji, upVoteEmoji } from "../../util/Shared";
import { NickRequest } from "../../core/tables/NickRequests";


export class NickDecision implements Preprocessor<MessageReaction> {
  public readonly name = "messageReactionAdd";
  public static readonly allow = upVoteEmoji;
  public static readonly deny = downVoteEmoji;

  public async process(bot: Bot, obj: any[]): Promise<MessageReaction | null> {
    const store = bot.store.nicks;
    const reaction: MessageReaction = obj[0];
    const user: User = obj[1];
    const messageID = reaction.message.id;
    const client = bot.getClient();

    // ignore ourselves
    if (client.user?.id == user.id)
      return obj[0];

    const nickReq = store.getReq(messageID);

    if (nickReq) {
      let approved = reaction.emoji.id == NickDecision.allow;

      await NickDecision.handle(bot, reaction.message, nickReq, approved);
    }

    return obj[0];
  }

  private static async handle(bot: Bot, message: Message, nickReq: NickRequest, approved: boolean) {
    const store = bot.store.nicks;
    const client = bot.getClient();
    const guild = client.guilds.cache.get(nickReq.guild);


    if (!guild) {
      // this will probably never happen sense the message reaction IS FROM
      // the same guild. but no need to deny sanity checking
      await message.delete();
      store.closeReq(nickReq.id);
      return;
    }

    const member = guild.member(nickReq.user);

    if (!member) {
      await message.delete();
      store.closeReq(nickReq.id);
      return;
    }

    if (approved)
      await member.setNickname(nickReq.nickname, "Request approved");

    store.closeReq(nickReq.id);
    await message.delete();
  }
}
