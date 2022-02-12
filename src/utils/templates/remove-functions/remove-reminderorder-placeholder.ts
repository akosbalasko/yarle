import { EOL } from 'os';

import * as T from '../placeholders/reminderorder-placeholders';

import { removePlaceholder } from './remove-placeholder';

export const removeReminderOrderPlaceholder = (text: string): string => {
  return removePlaceholder(text, T);
};
