import { TemplateBlockSettings } from '../template-settings';

import { NoteData } from './../../../models/NoteData';

export const getTemplateBlockSettings = (text: string, check: Function, T: any, value: string): TemplateBlockSettings => {
    return {
      template: text,
      check,
      startBlockPlaceholder: T.START_BLOCK,
      endBlockPlaceholder: T.END_BLOCK,
      valuePlaceholder: T.CONTENT_PLACEHOLDER,
      value,
    };
  };
