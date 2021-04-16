import * as fs from 'fs';
import { LOGFILE } from './loggerInfo';
export const clearLogFile = () => {
    if (fs.existsSync(LOGFILE))
        fs.unlinkSync(LOGFILE);
}