import sql from 'better-sqlite3';
import { ChannelTable } from "./tables/ChannelTable";


/**
 * This is the database controller. Here we can store data for modules
 * which they can use later.
 */
export class Store {
  private readonly db: sql.Database;
  public readonly channels: ChannelTable

  constructor() {
    this.db = sql('pewds_bot.db');
    this.channels = new ChannelTable(this.db);
  }

}
