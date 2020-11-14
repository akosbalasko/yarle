import { NoteData } from '../../../models/NoteData';
import * as P from './../placeholders/updatedat-placeholders';
import { applyConditionalTemplate } from './apply-conditional-template';

export const applyUpdatedAtTemplate = (noteData: NoteData, text: string): string => {
    return applyConditionalTemplate(text, P, noteData.updatedAt);
}