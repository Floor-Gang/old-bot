import { Preprocessor } from "../../core/models/Preprocessor";
import {
  TextChannel,
  VoiceChannel,
  VoiceState
} from "discord.js";
import { Bot } from "../../core/Bot";


type Linked = {
  [key: string]: string
}

export class ChannelLink implements Preprocessor<VoiceState> {
  private static readonly linked: Linked = {
    "718433475828645933": "722231096078631034",
    "718548936649998417": "722236118149365860",
    "718550846563942463": "722236425357099029",
    "718550967221485568": "722236508718759986"
  }
  public readonly name = "voiceStateUpdate";

  public async process(bot: Bot, obj: VoiceState[]): Promise<VoiceState | null> {
    const old = obj[0];
    const update = obj[1];
    const channelA = update.channel || old.channel;
    const linked = ChannelLink.linked[channelA ? channelA.id : ''];

    if (linked) {
      const client = bot.getClient();
      const channelB = await client.channels.fetch(linked);

      if (channelA && channelB) {
        await ChannelLink.sync(channelA, channelB as TextChannel);
      }

    }

    return update;
  }

  private static async sync(channelA: VoiceChannel, channelB: TextChannel) {
    const permsInText = channelB.permissionOverwrites;
    const shouldBeInText = channelA.members;

    // Remove anyone that is not to be in the text channel
    for (const perm of permsInText.values()) {
      if (!shouldBeInText.has(perm.id) && perm.type == 'member') {
        await perm.delete();
      }
    }

    // Now add the people who should be in the voice channel
    for (const member of shouldBeInText.values()) {
      if (!permsInText.has(member.id)) {
        await channelB.updateOverwrite(
          member.id,
          {
            VIEW_CHANNEL: true,
          }
        );
      }
    }
  }
}
