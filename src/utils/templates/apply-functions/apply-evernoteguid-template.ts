import { cloneDeep } from 'lodash';

import { NoteData } from '../../../models/NoteData';
import * as P from './../placeholders/evernoteguid-placeholders';
import { applyConditionalTemplate } from './apply-conditional-template';

export const applyEvernoteGuidTemplate = (noteData: NoteData, text: string): string => {
    return applyConditionalTemplate(text, P, "<YARLE_EVERNOTE_GUID_PLACEHOLDER>");
};
