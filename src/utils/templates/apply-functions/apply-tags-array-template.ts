import { cloneDeep, templateSettings } from 'lodash';

import { NoteData } from '../../../models/NoteData';
import * as P from '../placeholders/tags-array-placeholders';

import { applyTemplateOnBlock } from './apply-template-on-block';
import { getTemplateBlockSettings } from './get-templateblock-settings';
export const applyTagsArrayTemplate = (noteData: NoteData, inputText: string, check: Function): string => {
  const result = cloneDeep(inputText);
  let tags = noteData.tags ? JSON.stringify(noteData.tags.split(' ')) : undefined;

  const tagsTemplateSettings = getTemplateBlockSettings(result, check, P, tags);

  return applyTemplateOnBlock(tagsTemplateSettings);
};
