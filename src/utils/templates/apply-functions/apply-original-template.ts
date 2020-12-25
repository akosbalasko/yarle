import { NoteData } from '../../../models/NoteData';
import * as P from '../placeholders/original-placeholders';
import { applyConditionalTemplate } from './apply-conditional-template';

export const applyLinkToOriginalTemplate = (noteData: NoteData, text: string): string => {
    return applyConditionalTemplate(text, P, noteData.linkToOriginal);
};
