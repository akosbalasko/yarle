import { NoteData } from '../../../models/NoteData';

import * as P from './../placeholders/createdat-placeholders';
import { applyConditionalTemplate } from './apply-conditional-template';

export const applyCreatedAtTemplate = (noteData: NoteData, text: string): string => {
    return applyConditionalTemplate(text, P, noteData.createdAt);
};
