import { Table } from "./Table";
import { Database } from "better-sqlite3";
import { GuildChannel } from "discord.js";


export class ChannelsTable extends Table {
  constructor(db: Database) {
    super(db, "channels"); this.init();
  }

  public updateChannel(channel: GuildChannel, tag: string): boolean {
    const info = this.db.prepare(
      `UPDATE ${this.tableName} SET guild_id=?, channel_id=?, tag=?` +
      ` WHERE tag=? AND guild_id=?`
    ).run(channel.guild.id, channel.id, tag, tag, channel.guild.id);

    return info.changes > 0;
  }

  public addChannel(channel: GuildChannel, tag: string) {
    this.db.prepare(
      `INSERT INTO ${this.tableName} (guild_id, channel_id, tag) VALUES (?,?,?)`
    ).run(channel.guild.id, channel.id, tag);
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
      `(guild_id text NOT NULL, channel_id text NOT NULL, tag UNIQUE NOT NULL)`
    ).run();
  }
}
