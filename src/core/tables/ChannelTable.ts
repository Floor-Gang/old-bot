import { Table } from "./Table";
import { Database } from "better-sqlite3";


/**
 * This is for storing channel ID's and assigning them to a tag / name.
 */
export class ChannelTable extends Table {
  constructor(db: Database) {
    super(db, "channels");
    this.init();
  }

  public setChannel(tag: string, channelID: string): boolean {
    const info = this.db.prepare(
      `INSERT INTO ${this.tableName} (tag,channel_id) VALUES (?,?)`
    ).run(tag, channelID);

    return (info.changes > 0);
  }

  public getChannel(tag: string): string | null {
    const row = this.db.prepare(
      `SELECT channel_id FROM ${this.tableName} WHERE tag=?`
    ).get(tag);

    if (row) {
      return row.channel_id;
    } else {
      return null;
    }
  }

  private init() {
    this.db.prepare(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (` +
      `channel_id text NOT NULL,` +
      `tag text PRIMARY KEY NOT NULL)`
    ).run();
  }
}
