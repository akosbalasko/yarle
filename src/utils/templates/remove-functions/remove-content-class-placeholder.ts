import { EOL } from 'os';

import * as T from '../placeholders/content-class-placeholders';

import { removePlaceholder } from './remove-placeholder';

export const removeContentClassPlaceholder = (text: string): string => {
  return removePlaceholder(text, T);
};
