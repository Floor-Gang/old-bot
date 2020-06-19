import { Preprocessor } from "../../core/models/Preprocessor";
import { CategoryChannel, VoiceChannel, VoiceState } from "discord.js";
import { Bot } from "../../core/Bot";
import { Flux } from "../commands/Flux";


/**
 * This preprocessor will will create new voice channels when all the
 * gaming lobbies are full. When the gaming lobbies are empty the newly
 * created channels are deleted.
 */
export class GrowingLobby implements Preprocessor<VoiceState> {
  public readonly name = "voiceStateUpdate";

  public async process(bot: Bot, obj: VoiceState[]): Promise<VoiceState | null> {
    const store = bot.store.channels;
    const old = obj[0];
    const updated = obj[1];
    let channel: VoiceChannel | undefined;
    if (old.channel){
      channel = old.channel;
    } else if (updated.channel) {
      channel = updated.channel;
    }
    if (!channel) {
      return obj[1];
    }
    const category = channel.parent;
    if (!category)
      return obj[1];

    const isFluxCategory = store.hasChannel(category, Flux.category);

    if (!isFluxCategory)
      return obj[1];

    const parents = GrowingLobby.getParents(bot, category);
    const areFull = GrowingLobby.isFull(...parents);

    // If the main lobbies are full let's see if the child channels are full
    if (areFull) {
      await GrowingLobby.addMoreChildren(category, parents);
    } else {
      await GrowingLobby.checkEmptyChildren(category, parents);
    }

    return obj[0];
  }

  private static async addMoreChildren(category: CategoryChannel, parents: VoiceChannel[]) {
    const children = GrowingLobby.getChildren(category, parents);
    const isFull = GrowingLobby.isFull(...children);

    if (isFull) {
      await GrowingLobby.newChild(category);
    }
  }

  private static async checkEmptyChildren(category: CategoryChannel, parents: VoiceChannel[]) {
    const children = GrowingLobby.getChildren(category, parents);

    for (const channel of children) {
      if (channel.members.size == 0)
        await channel.delete();
    }
  }

  private static getChildren(category: CategoryChannel, parents: VoiceChannel[]): VoiceChannel[] {
    const result: VoiceChannel[] = [];
    const parentIDs = [];
    for (const parent of parents)
      parentIDs.push(parent.id);

    for (const channel of category.children.values()) {
      if (channel.type == 'voice' && !parentIDs.includes(channel.id)) {
        result.push(channel as VoiceChannel);
      }
    }
    return result;
  }

  private static getParents(bot: Bot, category: CategoryChannel): VoiceChannel[] {
    const result: VoiceChannel[] = [];
    const store = bot.store.channels;

    for (const channel of category.children.values()) {
      if (channel.type != 'voice')
        continue;
      const vc = channel as VoiceChannel;
      const isParent = store.hasChannel(vc, Flux.parents);

      if (isParent)
        result.push(vc);
    }

    return result;
  }

  private static async newChild(category: CategoryChannel) {
    const count = category.children.size;
    const channel = await category.guild.channels.create(
      `Gaming ${count + 1}`,
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
