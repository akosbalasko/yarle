import * as M from '../match-all';
import { EOL } from 'os';

export const removePlaceholder = (text: string, P: any) : string => {
  return text.replace(
    new RegExp(
      `${P.START_BLOCK}([\\D\\d])(?:.|${EOL})*?(?=${P.END_BLOCK})${P.END_BLOCK}${M.MATCH_LF}`,
      'g',
    ),
    '',
  );
}