import { applyTemplateOnBlock } from "./apply-template-on-block";
import { NoteData } from '../../../models/NoteData';
import * as P from './../placeholders/tags-placeholders';

import { cloneDeep } from "lodash";
import { getTemplateBlockSettings } from "./get-templateblock-settings";
export const applyTagsTemplate = (noteData: NoteData, inputText: string, check: Function): string => {
  const result = cloneDeep(inputText);
  const tagsTemplateSettings = getTemplateBlockSettings(result, check, P, noteData.tags);

  return applyTemplateOnBlock(tagsTemplateSettings);
}