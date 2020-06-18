import sql from 'better-sqlite3';
import { TagTable } from "./tables/TagTable";
import { ChannelLink } from "./tables/ChannelLink";


/**
 * This is the database controller. Here we can store data for modules
 * which they can use later.
 */
export class Store {
  private readonly db: sql.Database;
  public readonly tags: TagTable;
  public readonly channelLink: ChannelLink;

  constructor() {
    this.db = sql('pewds_bot.db');
    this.tags = new TagTable(this.db);
    this.channelLink = new ChannelLink(this.db);
  }
}
