import { NoteData } from '../../../models/NoteData';

import * as P from './../placeholders/content-class-placeholders';
import { applyConditionalTemplate } from './apply-conditional-template';

export const applyContentClassTemplate = (noteData: NoteData, text: string): string => {
    return applyConditionalTemplate(text, P, noteData.contentClass);
};
