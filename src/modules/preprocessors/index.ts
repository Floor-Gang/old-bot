import { Messages } from "./Messages";
import { Suggestions } from "./Suggestions";
import { ChannelLink } from "./ChannelLink";
import { GrowingLobby } from "./GrowingLobby";


/**
 * When a new Preprocessor class is made it should be appended to this array.
 */
export const preprocessors = [
  new Messages(),
  new Suggestions(),
  new ChannelLink(),
  new GrowingLobby(),
];
