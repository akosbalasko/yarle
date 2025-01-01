import { EOL } from 'os';

import * as T from '../placeholders/altitude-placeholders';

import { removePlaceholder } from './remove-placeholder';

export const removeAltitudePlaceholder = (text: string): string => {
  return removePlaceholder(text, T);
};
