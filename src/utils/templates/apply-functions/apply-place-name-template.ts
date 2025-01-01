import { NoteData } from '../../../models/NoteData';

import * as P from './../placeholders/place-name-placeholders';
import { applyConditionalTemplate } from './apply-conditional-template';

export const applyPlaceNameTemplate = (noteData: NoteData, text: string): string => {
    return applyConditionalTemplate(text, P, noteData.placeName);
};
