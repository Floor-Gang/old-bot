/**
 * A preprocessor processes a given object before sent to a Handler object.
 * This is good if you need to format a given object or handle it before a
 * handler.
 * @interface Preprocessor
 * @property {string} name The event name to listen for
 * @method process All T objects are processed here and are to be returned.
 * If null is returned then it's corresponding Handler will not be given
 * the object.
 */
import type { Bot } from "../Bot";

export interface Preprocessor<T> {
  name: string;
  process(client: Bot, obj: T[]): Promise<T | null>;
}
