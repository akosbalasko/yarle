import { EOL } from 'os';

import * as T from '../placeholders/source-placeholders';

import { removePlaceholder } from './remove-placeholder';

export const removeSourcePlaceholder = (text: string): string => {
  return removePlaceholder(text, T);
};
