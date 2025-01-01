import { NoteData } from '../../../models/NoteData';

import * as P from './../placeholders/application-data-yaml-list-placeholders';
import { applyConditionalTemplate } from './apply-conditional-template';

export const applyApplicationDataTemplate = (noteData: NoteData, text: string): string => {
    return applyConditionalTemplate(text, P, noteData.applicationData);
};
