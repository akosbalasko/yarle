import { NoteData } from '../../../models/NoteData';
import * as P from '../placeholders/reminderdonetime-placeholders';

import { applyConditionalTemplate } from './apply-conditional-template';

export const applyReminderDoneTimeTemplate = (noteData: NoteData, text: string): string => {
    return applyConditionalTemplate(text, P, noteData.reminderDoneTime);
};
