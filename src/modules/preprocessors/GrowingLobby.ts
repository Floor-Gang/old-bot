import { Preprocessor } from "../../core/models/Preprocessor";
import { CategoryChannel, VoiceChannel, VoiceState } from "discord.js";
import { Bot } from "../../core/Bot";


export class GrowingLobby implements Preprocessor<VoiceState> {
  public readonly name = "voiceStateUpdate";
  private readonly whitelist: string[] = [
    "722574493809377370",
    "722555211511627817",
    "722555282210684948"
  ];

  public async process(bot: Bot, obj: VoiceState[]): Promise<VoiceState | null> {
    const client = bot.getClient();
    const old = obj[0];
    const updated = obj[1];
    let channel: VoiceChannel | undefined;


    if (old.channel && this.whitelist.includes(old.channel.id)){
      channel = old.channel;
    } else if (updated.channel && this.whitelist.includes(updated.channel.id)) {
      channel = updated.channel;
    }
    if (!channel)
      return obj[1];

    const channelOne = await client.channels.fetch(this.whitelist[0]);
    const channelTwo = await client.channels.fetch(this.whitelist[1]);
    const channelThree = await client.channels.fetch(this.whitelist[2]);

    if (channelOne.type != 'voice')
      throw new Error(`Lobby one "${this.whitelist[0]}" is not a voice channel`);
    if (channelTwo.type != 'voice')
      throw new Error(`Lobby two "${this.whitelist[1]}" is not a voice channel`);
    if (channelThree.type != 'voice')
      throw new Error(`Lobby three "${this.whitelist[2]}" is not a voice channel.`);

    const lobbyOne = channelOne as VoiceChannel;
    const lobbyTwo = channelTwo as VoiceChannel;
    const lobbyThree = channelThree as VoiceChannel;
    const areFull = GrowingLobby.isFull(lobbyOne, lobbyTwo, lobbyThree);

    // If the main lobbies are full let's see if the child channels are full
    if (areFull) {
      if (lobbyOne.parent)
        await this.addMoreChildren(lobbyOne.parent);
      else
        throw new Error(`Lobby one "${this.whitelist[0]}" isn't in a category`);
    } else {
      if (lobbyOne.parent)
        await this.checkEmptyChildren(lobbyOne.parent);
      else
        throw new Error(`Lobby one "${this.whitelist[0]}" isn't in a category`);
    }

    return obj[0];
  }

  private async addMoreChildren(category: CategoryChannel) {
    const children = await this.getChildren(category);
    const isFull = GrowingLobby.isFull(...children);

    if (isFull) {
      await this.newChild(category);
    }
  }

  private async checkEmptyChildren(category: CategoryChannel) {
    const children = await this.getChildren(category);

    for (const channel of children) {
      if (channel.members.size == 0)
        await channel.delete();
    }
  }

  private async getChildren(category: CategoryChannel): Promise<VoiceChannel[]> {
    const result: VoiceChannel[] = [];

    for (const channel of category.children.values()) {
      if (channel.type == 'voice' && !this.whitelist.includes(channel.id)) {
        result.push(channel as VoiceChannel);
      }
    }
    return result;
  }

  private async newChild(category: CategoryChannel) {
    const count = (await this.getChildren(category)).length;
    const channel = await category.guild.channels.create(
      `Gaming ${count + 4}`,
      { type: 'voice' }
    );

    await channel.setParent(category);
  }

  private static isFull(...channels: VoiceChannel[]) {
    let isFull = true;
    for (const channel of channels) {
      if (channel.members.size == 0) {
        isFull = false;
        break;
      }
    }
    return isFull;
  }

}
