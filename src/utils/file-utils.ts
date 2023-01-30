import * as fs from 'fs';

import { setFileDates } from './content-utils';
import { logger } from './../utils/logger';
import { yarleOptions } from './../yarle';
import { isLogseqJournal } from './is-logseq-journal';

export const writeFile = (absFilePath: string, data: any, note: any): void => {
    try {
      if (isLogseqJournal(yarleOptions))
        fs.appendFileSync(absFilePath, data)
      else fs.writeFileSync(absFilePath, data);
      setFileDates(absFilePath, note);
    } catch (e) {
      // tslint:disable-next-line: no-console
      logger.error('Cannot write file ', e);
      throw e;
    }
  };
