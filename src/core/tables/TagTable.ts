import { Table } from "./Table";
import { Database } from "better-sqlite3";


/**
 * This is for storing channel ID's and assigning them to a tag / name.
 */
export class TagTable extends Table {
  constructor(db: Database) {
    super(db, "tags");
    this.init();
  }

  public setID(tag: string, id: string): boolean {
    const info = this.db.prepare(
      `INSERT INTO ${this.tableName} (tag,id) VALUES (?,?)`
    ).run(tag, id);

    return (info.changes > 0);
  }

  public getID(tag: string): string | null {
    const row = this.db.prepare(
      `SELECT id FROM ${this.tableName} WHERE tag=?`
    ).get(tag);

    if (row) {
      return row.channel_id;
    } else {
      return null;
    }
  }

  public removeID(tag: string): boolean {
    const info = this.db.prepare(
      `DELETE FROM ${this.tableName} WHERE tag=?`
    ).run(tag);

    return info.changes > 0;
  }

  public remove(tag: string, id: string): boolean {
    const info = this.db.prepare(
      `DELETE FROM ${this.tableName} WHERE tag=? AND id=?`
    ).run(tag, id);

    return info.changes > 0;
  }

  public getAllIDs(tag: string): string[] | null {
    const result = [];
    const rows = this.db.prepare(
      `SELECT id FROM ${this.tableName} WHERE tag=?`
    ).all(tag);

    for (const row of rows) {
      result.push(row.id);
    }

    return result;
  }

  public hasID(tag: string): boolean {
    return (this.getID(tag) != null);
  }

  public get(tag: string, id: string): [string, string][] | null {
    const result: [string, string][] = [];
    const rows = this.db.prepare(
      `SELECT * FROM ${this.tableName} WHERE tag=? AND id=?`
    ).all(tag, id);


    if (!rows)
      return null;

    for (const row of rows) {
      result.push([row.tag, row.id]);
    }

    if (result.length == 0)
      return null;

    return result;
  }

  public has(tag: string, id: string): boolean {
    const result = this.get(tag, id);

    return !(result == null || result.length == 0);
  }

  private init() {
    this.db.prepare(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (` +
      `id text NOT NULL,` +
      `tag text NOT NULL)`
    ).run();
  }
}
