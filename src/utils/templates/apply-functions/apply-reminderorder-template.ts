import { NoteData } from '../../../models/NoteData';
import * as P from '../placeholders/reminderorder-placeholders';

import { applyConditionalTemplate } from './apply-conditional-template';

export const applyReminderOrderTemplate = (noteData: NoteData, text: string): string => {
    return applyConditionalTemplate(text, P, noteData.reminderOrder);
};
