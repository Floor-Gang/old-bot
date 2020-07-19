import { Ping } from './Ping';
import type { Command } from "../../core/models/Command";
import { Who } from "./Who";
import { Admin } from "./Admin";
import { Rules } from "./Rules";
import { Flux } from "./Flux";

/**
 * When a new Command class is created it must be appended to this array.
 */
export const commands: Command[] = [
  new Admin(),
  new Ping(),
  new Who(),
  new Rules(),
  new Flux(),
];
