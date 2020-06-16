import { Database } from "better-sqlite3";


export class Table {
  protected readonly tableName: string;
  protected readonly db: Database;

  constructor(db: Database, tableName: string) {
    this.db = db;
    this.tableName = tableName;
  }
}
