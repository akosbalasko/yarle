import { EOL } from 'os';

import * as T from '../placeholders/source-url-placeholders';

import { removePlaceholder } from './remove-placeholder';

export const removeSourceUrlPlaceholder = (text: string): string => {
  return removePlaceholder(text, T);
};
