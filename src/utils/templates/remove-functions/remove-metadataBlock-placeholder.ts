import { EOL } from 'os';

import * as T from '../placeholders';
import * as M from '../match-all';

export const removeMetadataBlockPlaceholder = (text: string): string => {
    return text.replace(
        new RegExp(
          `${T.START_METADATA_BLOCK}${M.MATCH_ALL}${T.END_METADATA_BLOCK}${EOL}`,
          'g',
        ),
        '',
      );
}