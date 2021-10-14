import { NoteData } from '../../../models/NoteData';

import * as P from './../placeholders/notebook-placeholders';
import { applyConditionalTemplate } from './apply-conditional-template';

export const applyNotebookTemplate = (noteData: NoteData, text: string): string => {
    return applyConditionalTemplate(text, P, noteData.notebookName);
};
