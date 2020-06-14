import { Ping } from './Ping';
import type { Command } from "../../core/models/Command";

/**
 * When a new Command class is created it must be appended to this array.
 */
export const commands: Command[] = [
  new Ping()
];
