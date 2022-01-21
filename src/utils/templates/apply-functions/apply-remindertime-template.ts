import { NoteData } from '../../../models/NoteData';
import * as P from '../placeholders/remindertime-placeholders';

import { applyConditionalTemplate } from './apply-conditional-template';

export const applyReminderTimeTemplate = (noteData: NoteData, text: string): string => {
    return applyConditionalTemplate(text, P, noteData.reminderTime);
};
