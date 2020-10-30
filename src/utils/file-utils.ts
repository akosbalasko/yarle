import * as fs from 'fs';
import * as util from 'util';

import { setFileDates } from './content-utils';

export const writeMdFile = (absFilePath: string, data: any, note: any): void => {
    try {
      fs.writeFileSync(absFilePath, data);
      setFileDates(absFilePath, note);
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log('Cannot write file ', e);
      throw e;
    }
  };

