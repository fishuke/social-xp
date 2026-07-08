// Dictionary accessor usable from both server and client. Both locales are
// small (~200 strings) so bundling both everywhere is fine and avoids async
// loading / server-client function-serialization headaches.

import type { Locale } from "../config";
import en from "./en";
import tr from "./tr";

export type { Dictionary } from "./en";

export const dictionaries = { en, tr } as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
