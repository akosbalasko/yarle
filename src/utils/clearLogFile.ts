import * as fs from 'fs';
import * as  fsextra from 'fs-extra';

import { LOGFILE } from './loggerInfo';
export const clearLogFile = () => {
    // tslint:disable-next-line:no-console
    console.log(`clearing log: ${LOGFILE}`);
    if (fs.existsSync(LOGFILE)) {
        fsextra.removeSync(LOGFILE);
    }
};
