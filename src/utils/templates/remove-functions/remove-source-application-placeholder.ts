import { EOL } from 'os';

import * as T from '../placeholders/source-application-placeholders';

import { removePlaceholder } from './remove-placeholder';

export const removeSourceApplicationPlaceholder = (text: string): string => {
  return removePlaceholder(text, T);
};
