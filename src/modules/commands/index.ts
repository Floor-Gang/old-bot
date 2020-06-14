import { Ping } from './Ping';
import type { Command } from "../../core/models/Command";


export const commands: Command[] = [
  new Ping()
];
