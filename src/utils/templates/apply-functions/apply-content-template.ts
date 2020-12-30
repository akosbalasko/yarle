import { applyTemplateOnBlock } from "./apply-template-on-block";
import { NoteData } from '../../../models/NoteData';
import * as P from '../placeholders/content-placeholders';
import { cloneDeep } from "lodash";
import { getTemplateBlockSettings } from "./get-templateblock-settings";

export const applyContentTemplate = (noteData: NoteData, inputText: string, check: Function): string => {
    const result = cloneDeep(inputText);
    const contentTemplateSettings = getTemplateBlockSettings(result, check, P, noteData.content);
  return applyTemplateOnBlock(contentTemplateSettings);
}

