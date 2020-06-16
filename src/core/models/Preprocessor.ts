import type { Bot } from "../Bot";


/**
 * A preprocessor processes a given object before sent to a Handler object.
 * This is good if you need to format a given object or handle it before a
 * handler.
 */
export interface Preprocessor<T> {
  name: string;
  process(bot: Bot, obj: T[]): Promise<T | null>;
}
