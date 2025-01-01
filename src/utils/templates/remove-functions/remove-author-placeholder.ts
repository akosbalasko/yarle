import { EOL } from 'os';

import * as T from '../placeholders/author-placeholders';

import { removePlaceholder } from './remove-placeholder';

export const removeAuthorPlaceholder = (text: string): string => {
  return removePlaceholder(text, T);
};
