import { EOL } from 'os';

import * as T from '../placeholders/subject-date-placeholders';

import { removePlaceholder } from './remove-placeholder';

export const removeSubjectDatePlaceholder = (text: string): string => {
  return removePlaceholder(text, T);
};
