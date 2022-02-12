import { EOL } from 'os';

import * as T from '../placeholders/remindertime-placeholders';

import { removePlaceholder } from './remove-placeholder';

export const removeReminderTimePlaceholder = (text: string): string => {
  return removePlaceholder(text, T);
};
