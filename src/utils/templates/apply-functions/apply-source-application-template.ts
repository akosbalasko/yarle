import { NoteData } from '../../../models/NoteData';

import * as P from './../placeholders/source-application-placeholders';
import { applyConditionalTemplate } from './apply-conditional-template';

export const applySourceApplicationTemplate = (noteData: NoteData, text: string): string => {
    return applyConditionalTemplate(text, P, noteData.sourceApplication);
};
