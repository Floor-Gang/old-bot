import { Table } from "./Table";
import { Database } from "better-sqlite3";


export class ChannelLink extends Table {
  constructor(db: Database) {
    super(db, "channel_link");
    this.init();
  }

  public setLink(voiceChannelID: string, txtChannelID: string): boolean {
    const info = this.db.prepare(
      `INSERT INTO ${this.tableName} (vc,txt) VALUES (?,?)`
    ).run(voiceChannelID, txtChannelID);

    return (info.changes > 0);
  }

  public getLink(voiceChannelID: string): string | null {
    const row = this.db.prepare(
      `SELECT txt FROM ${this.tableName} WHERE vc=?`
    ).get(voiceChannelID);

    if (row) {
      return row.txt;
    } else {
      return null;
    }
  }

  public getAll(): [string, string][] | null {
    const result: [string, string][] = [];
    const rows = this.db.prepare(
      `SELECT * FROM ${this.tableName}`
    ).all();

    for (const row of rows) {
      result.push([row.vc, row.txt]);
    }

    return result;
  }

  public unLink(channelID: string): boolean {
    const info = this.db.prepare(
      `DELETE FROM ${this.tableName} WHERE vc=? OR txt=?`
    ).run(channelID, channelID);

    return info.changes > 0;
  }

  private init() {
    this.db.prepare(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (` +
      `vc text UNIQUE NOT NULL,` +
      `txt text UNIQUE NOT NULL)`
    ).run();
  }
}
