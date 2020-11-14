import { TemplateBlockSettings } from "./../template-settings";
import * as M from './../match-all';

export const applyTemplateOnBlock = ({
  template,
  check,
  startBlockPlaceholder,
  endBlockPlaceholder,
  valuePlaceholder,
  value,
}: TemplateBlockSettings): string => {
  if (value && check()) {
    return template
      .replace(startBlockPlaceholder, '')
      .replace(endBlockPlaceholder, '')
      .replace(valuePlaceholder, value);
  }

  return template.replace(
    new RegExp(
      `${startBlockPlaceholder}${M.MATCH_ALL}${endBlockPlaceholder}`,
      'g',
    ),
    '',
  );
}