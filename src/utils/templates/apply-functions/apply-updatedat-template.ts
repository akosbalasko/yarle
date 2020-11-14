import { NoteData } from '../../../models/NoteData';
import { TemplateBlockSettings } from "./../template-settings";
import * as P from './../placeholders';

export const applyUpdatedAtTemplate = (noteData: NoteData, text: string): string => {
    return text.replace(P.UPDATED_AT_PLACEHOLDER, noteData.updatedAt)
    .replace(P.START_UPDATED_AT_BLOCK, '')
    .replace(P.END_UPDATED_AT_BLOCK, '');
}