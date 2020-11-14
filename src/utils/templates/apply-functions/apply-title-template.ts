import { applyTemplateOnBlock } from "./apply-template-on-block";
import { NoteData } from '../../../models/NoteData';
import { TemplateBlockSettings } from "./../template-settings";
import * as P from './../placeholders';
import { cloneDeep } from "lodash";

export const applyTitleTemplate = (noteData: NoteData, inputText: string, check: Function): string => {
    const result = cloneDeep(inputText);
    const titleTemplateSettings: TemplateBlockSettings = {
    template: result,
    check,
    startBlockPlaceholder: P.START_TITLE_BLOCK,
    endBlockPlaceholder: P.END_TITLE_BLOCK,
    valuePlaceholder: P.TITLE_PLACEHOLDER,
    value: noteData.title,
  }

  return applyTemplateOnBlock(titleTemplateSettings);
}