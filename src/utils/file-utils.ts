import * as fs from 'fs';

import { setFileDates } from './content-utils';

export const writeFile = (absFilePath: string, data: any, note: any): void => {
    try {
      fs.writeFileSync(absFilePath, data);
      setFileDates(absFilePath, note);
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log('Cannot write file ', e);
      throw e;
    }
  };
