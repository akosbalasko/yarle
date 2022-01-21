import { EOL } from 'os';

import * as T from '../placeholders/reminderdonetime-placeholders';

import { removePlaceholder } from './remove-placeholder';

export const removeReminderDoneTimePlaceholder = (text: string): string => {
  return removePlaceholder(text, T);
};
