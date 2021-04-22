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
      .replace(new RegExp(`${startBlockPlaceholder}`,'g'), '')
      .replace(new RegExp(`${endBlockPlaceholder}`,'g'), '')
      .replace(new RegExp(`${valuePlaceholder}`,'g'), value);
      
  }
const reg = `${startBlockPlaceholder}([\\d\\D])(?:.|(\r\n|\r|\n))*?(?=${endBlockPlaceholder})${endBlockPlaceholder}`;
  return template.replace(
    new RegExp(reg,
      'g',
    ),
    '',
  );
}