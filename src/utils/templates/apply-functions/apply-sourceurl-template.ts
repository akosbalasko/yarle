import { NoteData } from '../../../models/NoteData';
import * as P from './../placeholders/sourceurl-placeholders';
import { applyConditionalTemplate } from './apply-conditional-template';

export const applySourceUrlTemplate = (noteData: NoteData, text: string): string => {
    return applyConditionalTemplate(text, P, noteData.sourceUrl);
}
