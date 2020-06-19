import { Table } from "./Table";
import { Database } from "better-sqlite3";
import { v1 as uuid } from 'uuid';
import { GuildMember } from "discord.js";


export type NickRequest = {
  user: string;
  nickname: string;
  guild: string;
  id: string;
}

export class NickRequests extends Table {
  constructor(db: Database) {super(db, "nick_requests"); this.init()}

  public addReq(user: GuildMember, nickname: string, msgID: string): string {
    const id = uuid().split('-')[0];
    this.db.prepare(
      `INSERT INTO ${this.tableName}` +
      ` (req_id, user_id, guild_id, nickname, msg_id)` +
      ` VALUES (?,?,?,?,?)`
    ).run(id, user.id, user.guild.id, nickname, msgID);

    return id;
  }

  public getReq(id: string): NickRequest | null {
    const row = this.db.prepare(
      `SELECT * FROM ${this.tableName} WHERE req_id=? OR msg_id=?`
    ).get(id, id);

    if (!row)
      return null;

    return {
      user: row.user_id,
      nickname: row.nickname,
      guild: row.guild_id,
      id: row.req_id,
    };
  }

  public closeReq(id: string): boolean {
    const info = this.db.prepare(
      `DELETE FROM ${this.tableName} WHERE req_id=?`
    ).run(id);

    return info.changes > 0;
  }

  public hasReq(userID: string): boolean {
    const row = this.db.prepare(
      `SELECT req_id FROM ${this.tableName} WHERE user_id=?`
    ).get(userID);

    if (!row)
      return false;
    else return !!row.req_id;
  }

  private init() {
    this.db.prepare(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (` +
      ` req_id TEXT UNIQUE NOT NULL,` +
      ` user_id TEXT NOT NULL,`+
      ` guild_id TEXT NOT NULL,` +
      ` nickname TEXT UNIQUE NOT NULL,` +
      ` msg_id TEXT UNIQUE` +
      `)`
    ).run()
  }
}
