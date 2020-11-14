import { EOL } from 'os';

import * as T from '../placeholders';
import * as M from '../match-all';

export const removeNotebookPlaceholder = (text: string): string => {
    return text.replace(
        new RegExp(
          `${T.START_NOTEBOOK_BLOCK}${M.MATCH_ALL}${T.END_NOTEBOOK_BLOCK}${EOL}`,
          'g',
        ),
        '',
      );
}