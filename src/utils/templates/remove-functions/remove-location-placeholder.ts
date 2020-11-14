import { EOL } from 'os';

import * as T from '../placeholders';
import * as M from '../match-all';

export const removeLocationPlaceholder = (text: string): string => {
    return text.replace(
        new RegExp(
          `${T.START_LOCATION_BLOCK}${M.MATCH_ALL}${T.END_LOCATION_BLOCK}${EOL}`,
          'g',
        ),
        '',
      );
}