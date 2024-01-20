import * as T from '../placeholders/evernotelink-placeholders';

import { removePlaceholder } from './remove-placeholder';

export const removeEvernoteLinkPlaceholder = (text: string): string => {
  return removePlaceholder(text, T);
};
