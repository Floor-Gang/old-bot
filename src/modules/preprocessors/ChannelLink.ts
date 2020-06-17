import { Preprocessor } from "../../core/models/Preprocessor";
import {
  TextChannel,
  VoiceChannel,
  VoiceState
} from "discord.js";
import { Bot } from "../../core/Bot";


export class ChannelLink implements Preprocessor<VoiceState> {
  public readonly name = "voiceStateUpdate";

  public async process(bot: Bot, obj: VoiceState[]): Promise<VoiceState | null> {
    const old = obj[0];
    const update = obj[1];
    const channelA = update.channel || old.channel;
    const linked = ChannelLink.getLinked(bot, channelA ? channelA.id : '');

    if (linked) {
      const client = bot.getClient();
      const channelB = await client.channels.fetch(linked);

      if (channelA && channelB) {
        await ChannelLink.sync(channelA, channelB as TextChannel);
      }
    }

    return update;
  }

  private static getLinked(bot: Bot, voiceChannelID: string): string | null {
    const channels = bot.store.channelLink;

    return channels.getLink(voiceChannelID);
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
