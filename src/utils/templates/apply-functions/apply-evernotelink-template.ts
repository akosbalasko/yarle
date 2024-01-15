import { cloneDeep } from 'lodash';

import { NoteData } from '../../../models/NoteData';
import * as P from './../placeholders/evernotelink-placeholders';
import { applyConditionalTemplate } from './apply-conditional-template';

export const applyEvernoteLinkTemplate = (noteData: NoteData, text: string): string => {
    return applyConditionalTemplate(text, P, "<YARLE_EVERNOTE_LINK_PLACEHOLDER>");
};
