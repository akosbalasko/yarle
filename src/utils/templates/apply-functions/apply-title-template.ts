import { applyTemplateOnBlock } from "./apply-template-on-block";
import { NoteData } from '../../../models/NoteData';
import * as P from './../placeholders/title-placeholders';
import { cloneDeep } from "lodash";
import { getTemplateBlockSettings } from "./get-templateblock-settings";

export const applyTitleTemplate = (noteData: NoteData, inputText: string, check: Function): string => {
  const result = cloneDeep(inputText);
  const titleTemplateSettings = getTemplateBlockSettings(result, check, P, noteData.title)

  return applyTemplateOnBlock(titleTemplateSettings);
}