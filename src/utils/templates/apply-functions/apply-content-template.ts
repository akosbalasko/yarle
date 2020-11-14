import { applyTemplateOnBlock } from "./apply-template-on-block";
import { NoteData } from '../../../models/NoteData';
import { TemplateBlockSettings } from "../template-settings";
import * as P from '../placeholders';
import { cloneDeep } from "lodash";

export const applyContentTemplate = (noteData: NoteData, inputText: string, check: Function): string => {
    const result = cloneDeep(inputText);
    const tagsTemplateSettings: TemplateBlockSettings = {
      template: result,
      check,
      startBlockPlaceholder: P.START_CONTENT_BLOCK,
      endBlockPlaceholder: P.END_CONTENT_BLOCK,
      valuePlaceholder: P.CONTENT_PLACEHOLDER,
      value: noteData.content,
  }

  return applyTemplateOnBlock(tagsTemplateSettings);
}