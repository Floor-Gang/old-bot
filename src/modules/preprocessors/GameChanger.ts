import { Preprocessor } from "../../core/models/Preprocessor";
import { Activity, VoiceChannel, VoiceState } from "discord.js";
import { Bot } from "../../core/Bot";


export class GameChanger implements Preprocessor<VoiceState> {
  public readonly name = "voiceStateUpdate";
  private readonly whitelist: string[] = [
    "718553303167926333",
    "720121442594848849",
    "720121552967827488",
  ];
  private changes: Map<string, string> = new Map();

  public async process(bot: Bot, obj: VoiceState[]): Promise<VoiceState | null> {
    const old = obj[0];
    const updated = obj[1];
    const channel = old.channel || updated.channel;

    if (channel) {
      if (!this.whitelist.includes(channel.id))
        return obj[0];

      const mostPlayed = GameChanger.calculate(channel);

      if (mostPlayed) {
        this.changes.set(channel.id, channel.name);
        await channel.setName(mostPlayed.name);
      } else {
        const oldName = this.changes.get(channel.id);

        if (oldName)
          await channel.setName(oldName);
      }
    }

    return obj[0];
  }

  private static calculate(channel: VoiceChannel): Activity | null {
    let games: [number, Activity][] = [];
    let mostPlayed: [number, Activity] | null = null;

    // Get all the games being plaid
    for (const member of channel.members.values()) {
      const game = member.presence.activities.find(x => x.type == "PLAYING");

      if (game) {
        const i = games.findIndex((x) => {
          let storedGame = x[1];
          return (storedGame.name == game.name);
        })
        const stored = games[i];

        if (stored) {
          games[i][0]++;
        } else if (game) {
          games.push([1, game]);
        }
      }
    }

    for (const [playing, game] of games) {
      if (!mostPlayed)
        mostPlayed = [playing, game];

      if (playing >= mostPlayed[0])
        mostPlayed = [playing, game]
    }

    return mostPlayed ? mostPlayed[1] : null;
  }

}
