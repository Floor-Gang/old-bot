import { Table } from "./Table";
import { Database } from "better-sqlite3";


export type FaQ = {
  guild: string;
  question: string;
  answer: string;
}

export class FaqTable extends Table {
  constructor(db: Database) { super(db, "faq"); this.init(); }

  public addQuestion(guild: string, question: string, answer: string) {
    const info = this.db.prepare(
      `INSERT INTO ${this.tableName} (guild_id,question,answer) VALUES (?,?,?)`
    ).run(guild, question, answer);

    return info.changes > 0;
  }

  public remQuestion(guild: string, question: string) {
    const info = this.db.prepare(
      `DELETE FROM ${this.tableName} WHERE guild_id=? AND question=? COLLATE NOCASE`
    ).run(guild, question);

    return info.changes > 0;
  }

  public allQuestions(guild: string): FaQ[] {
    const rows = this.db.prepare(
      `SELECT * FROM ${this.tableName} WHERE guild_id=?`
    ).all(guild);
    const result = [];

    for (const row of rows) {
      result.push({
        guild: row.guild_id,
        question: row.question,
        answer: row.answer,
      })
    }

    return result;
  }


  private init() {
    this.db.prepare(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (` +
      ` guild_id TEXT NOT NULL,` +
      ` question TEXT NOT NULL,` +
      ` answer TEXT NOT NULL` +
      `)`
    ).run()
  }

}
