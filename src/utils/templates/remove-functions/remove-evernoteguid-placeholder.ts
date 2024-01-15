import * as T from '../placeholders/evernoteguid-placeholders';

import { removePlaceholder } from './remove-placeholder';

export const removeEvernoteGuidPlaceholder = (text: string): string => {
  return removePlaceholder(text, T);
};
