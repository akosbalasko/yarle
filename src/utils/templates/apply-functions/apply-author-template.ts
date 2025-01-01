import { NoteData } from '../../../models/NoteData';

import * as P from './../placeholders/author-placeholders';
import { applyConditionalTemplate } from './apply-conditional-template';

export const applyAuthorTemplate = (noteData: NoteData, text: string): string => {
    return applyConditionalTemplate(text, P, noteData.author);
};
