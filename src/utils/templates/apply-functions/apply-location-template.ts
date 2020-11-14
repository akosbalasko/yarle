import { NoteData } from '../../../models/NoteData';
import * as P from './../placeholders/location-placeholders';
import { applyConditionalTemplate } from './apply-conditional-template';

export const applyLocationTemplate = (noteData: NoteData, text: string): string => {
    return applyConditionalTemplate(text, P, noteData.location);
}