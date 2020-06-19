import sql from 'better-sqlite3';
import { ChannelLink } from "./tables/ChannelLink";
import { ChannelsTable } from "./tables/ChannelsTable";
import { NickRequests } from "./tables/NickRequests";


/**
 * This is the database controller. Here we can store data for modules
 * which they can use later.
 */
export class Store {
  private readonly db: sql.Database;
  public readonly channelLink: ChannelLink;
  public readonly channels: ChannelsTable;
  public readonly nicks: NickRequests;

  constructor() {
    this.db = sql('pewds_bot.db');
    this.channelLink = new ChannelLink(this.db);
    this.channels = new ChannelsTable(this.db);
    this.nicks = new NickRequests(this.db);
  }
}
