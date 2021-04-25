import * as fs from 'fs';

import * as  fsextra from 'fs-extra';

import { LOGFILE } from './loggerInfo';
export const clearLogFile = () => {
    console.log('clearing log: ' + LOGFILE);
    if (fs.existsSync(LOGFILE))
        fsextra.removeSync(LOGFILE);
}