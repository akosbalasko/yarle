import { EOL } from 'os';

import * as T from '../placeholders';
import * as M from '../match-all';

export const removeUpdatedAtPlaceholder = (text: string): string => {
    return text.replace(
        new RegExp(
          `${T.START_UPDATED_AT_BLOCK}${M.MATCH_ALL}${T.END_UPDATED_AT_BLOCK}${EOL}`,
          'g',
        ),
        '',
      );
}