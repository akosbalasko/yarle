import { EOL } from 'os';

import * as T from '../placeholders/createdat-placeholders';

import { removePlaceholder } from './remove-placeholder';

export const removeCreatedAtPlaceholder = (text: string): string => {
  return removePlaceholder(text, T);
};
