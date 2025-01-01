import { EOL } from 'os';

import * as T from '../placeholders/application-data-yaml-list-placeholders';

import { removePlaceholder } from './remove-placeholder';

export const removeApplicationDataPlaceholder = (text: string): string => {
  return removePlaceholder(text, T);
};
