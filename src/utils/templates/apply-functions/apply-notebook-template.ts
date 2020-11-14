import { NoteData } from '../../../models/NoteData';
import * as P from './../placeholders';

export const applyNotebookTemplate = (noteData: NoteData, text: string): string => {
    return text
        .replace(P.NOTEBOOK_PLACEHOLDER, noteData.notebookName)
        .replace(P.START_NOTEBOOK_BLOCK, '')
        .replace(P.END_NOTEBOOK_BLOCK, '');
}