import { EOL } from 'os';

import * as T from '../placeholders/place-name-placeholders';

import { removePlaceholder } from './remove-placeholder';

export const removePlaceNamePlaceholder = (text: string): string => {
  return removePlaceholder(text, T);
};
