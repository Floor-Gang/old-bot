import { Table } from "./Table";
import { Database } from "better-sqlite3";
import { GuildChannel } from "discord.js";


export class ChannelsTable extends Table {
  constructor(db: Database) {
    super(db, "channels"); this.init();
  }

  public updateChannel(channel: GuildChannel, tag: string): boolean {
    const info = this.db.prepare(
      `UPDATE ${this.tableName} SET guild_id=?, channel_id=?` +
      ` WHERE tag=? AND guild_id=?`
    ).run(channel.guild.id, channel.id, tag, channel.guild.id);

    return info.changes > 0;
  }

  public set(channel: GuildChannel, tag: string) {
    try {
      this.addChannel(channel, tag);
    } catch (err) {
      this.updateChannel(channel, tag);
    }
  }

  public getAll(tag: string): string[] {
    const result: string[] = [];
    const rows = this.db.prepare(
      `SELECT channel_id FROM ${this.tableName} WHERE tag=?`
    ).all(tag);

    for (const row of rows) {
      result.push(row.channel_id);
    }

    return result;
  }

  public getGuild(guildID: string, tag: string): string[] {
    const result: string[] = [];
    const rows = this.db.prepare(
      `SELECT channel_id FROM ${this.tableName} WHERE tag=? AND guild_id=?`
    ).all(tag, guildID);

    for (const row of rows) {
      result.push(row.channel_id);
    }

    return result;
  }

  public addChannel(channel: GuildChannel, tag: string) {
    this.db.prepare(
      `INSERT INTO ${this.tableName} (guild_id, channel_id, tag) VALUES (?,?,?)`
    ).run(channel.guild.id, channel.id, tag);
  }

  public remove(channel: GuildChannel, tag: string) {
    const info = this.db.prepare(
      `DELETE FROM ${this.tableName} WHERE channel_id=? AND tag=?`
    ).run(channel.id, tag);

    return info.changes > 0;
  }

  public getChannel(guildID: string, tag: string): string | null {
    const row = this.db.prepare(
      `SELECT channel_id FROM ${this.tableName} WHERE guild_id=? AND tag=?`
    ).get(guildID, tag);

    if (!row)
      return null;

    return row.channel_id || null;
  }

  public hasChannel(channel: GuildChannel, tag: string): boolean {
    const row = this.db.prepare(
      `SELECT channel_id FROM ${this.tableName} WHERE guild_id=? AND channel_id=? AND tag=?`
    ).get(channel.guild.id, channel.id, tag);

    return (row != undefined && row.channel_id != undefined);
  }

  private init() {
    this.db.prepare(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} ` +
      `(guild_id text NOT NULL, channel_id text NOT NULL, tag NOT NULL)`
    ).run();
  }
}
