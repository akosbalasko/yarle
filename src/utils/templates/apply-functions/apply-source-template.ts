import { NoteData } from '../../../models/NoteData';

import * as P from './../placeholders/source-placeholders';
import { applyConditionalTemplate } from './apply-conditional-template';

export const applySourceTemplate = (noteData: NoteData, text: string): string => {
    return applyConditionalTemplate(text, P, noteData.source);
};
