import { cloneDeep, templateSettings } from 'lodash';

import { NoteData } from '../../../models/NoteData';
import * as P from '../placeholders/tags-array-placeholders';

import { applyTemplateOnBlock } from './apply-template-on-block';
import { getTemplateBlockSettings } from './get-templateblock-settings';
export const applyTagsArrayTemplate = (noteData: NoteData, inputText: string, check: Function): string => {
  const result = cloneDeep(inputText);

   if (noteData.tags) {
    noteData.tags = JSON.stringify(noteData.tags.split(' '));
   }
  const tagsTemplateSettings = getTemplateBlockSettings(result, check, P, noteData.tags);

  return applyTemplateOnBlock(tagsTemplateSettings);
};
