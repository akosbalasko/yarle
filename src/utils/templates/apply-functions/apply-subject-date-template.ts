import { NoteData } from '../../../models/NoteData';

import * as P from './../placeholders/subject-date-placeholders';
import { applyConditionalTemplate } from './apply-conditional-template';

export const applySubjectDateTemplate = (noteData: NoteData, text: string): string => {
    return applyConditionalTemplate(text, P, noteData.subjectDate);
};
