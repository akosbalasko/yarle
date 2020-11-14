import { NoteData } from '../../../models/NoteData';
import { TemplateBlockSettings } from "./../template-settings";
import * as P from './../placeholders';

export const applyCreatedAtTemplate = (noteData: NoteData, text: string): string => {
    return text.replace(P.CREATED_AT_PLACEHOLDER, noteData.createdAt)
        .replace(P.START_CREATED_AT_BLOCK, '')
        .replace(P.END_CREATED_AT_BLOCK, '');
}