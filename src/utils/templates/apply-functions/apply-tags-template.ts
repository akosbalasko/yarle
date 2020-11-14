import { applyTemplateOnBlock } from "./apply-template-on-block";
import { NoteData } from '../../../models/NoteData';
import { TemplateBlockSettings } from "./../template-settings";
import * as P from './../placeholders';

import { cloneDeep } from "lodash";
export const applyTagsTemplate = (noteData: NoteData, inputText: string, check: Function): string => {
    const result = cloneDeep(inputText);
    const tagsTemplateSettings: TemplateBlockSettings = {
      template: result,
      check,
      startBlockPlaceholder: P.START_TAGS_BLOCK,
      endBlockPlaceholder: P.END_TAGS_BLOCK,
      valuePlaceholder: P.TAGS_PLACEHOLDER,
      value: noteData.tags,
  }

  return applyTemplateOnBlock(tagsTemplateSettings);
}