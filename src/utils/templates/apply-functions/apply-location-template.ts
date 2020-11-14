import { NoteData } from '../../../models/NoteData';
import { TemplateBlockSettings } from "./../template-settings";
import * as P from './../placeholders';

export const applyLocationTemplate = (noteData: NoteData, text: string): string => {
    return text
        .replace(P.LOCATION_PLACEHOLDER, noteData.location)
        .replace(P.START_LOCATION_BLOCK, '')
        .replace(P.END_LOCATION_BLOCK, '');
}