import { EOL } from 'os';

import * as T from '../placeholders';
import * as M from '../match-all';

export const removeCreatedAtPlaceholder = (text: string): string => {
    return text.replace(
        new RegExp(
          `${T.START_CREATED_AT_BLOCK}${M.MATCH_ALL}${T.END_CREATED_AT_BLOCK}${EOL}`,
          'g',
        ),
        '',
      );
}