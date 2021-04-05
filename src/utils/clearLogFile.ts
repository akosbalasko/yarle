import * as fs from 'fs';
import { LOGFILE } from './loggerInfo';
export const clearLogFile = () => {
    fs.truncateSync(`file:${LOGFILE}`)
}