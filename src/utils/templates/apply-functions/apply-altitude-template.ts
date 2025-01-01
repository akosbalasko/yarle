import { NoteData } from '../../../models/NoteData';

import * as P from './../placeholders/altitude-placeholders';
import { applyConditionalTemplate } from './apply-conditional-template';

export const applyAltitudeTemplate = (noteData: NoteData, text: string): string => {
    return applyConditionalTemplate(text, P, noteData.altitude);
};
