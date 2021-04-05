import * as fs from 'fs';
import * as path from 'path';
const {EOL} = require('os');

const LOGFILE =  path.join(__dirname,'/conversion.log');
export const loggerInfo = (message: string) => {
    fs.appendFileSync(LOGFILE, `${message}${EOL}`);
}