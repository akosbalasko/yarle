import * as fs from 'fs';
import * as path from 'path';
// tslint:disable-next-line:no-require-imports
const {EOL} = require('os');

const getAppDataPath = () => {
    switch (process.platform) {
      case 'darwin': {
        return path.join(process.env.HOME, 'Library', 'Application Support', 'yarle-evernote-to-md');
      }
      case 'win32': {
        return path.join(process.env.APPDATA, 'yarle-evernote-to-md');
      }
      case 'linux': {
        return path.join(process.env.HOME, '.yarle-evernote-to-md');
      }
      default: {
        // tslint:disable-next-line:no-console
        console.log('Unsupported platform!');
        process.exit(1);
      }
    }
  };

export const LOGFILE =  path.join(getAppDataPath(), 'conversion.log');
// tslint:disable-next-line:no-console
console.log(`logfilepath: ${LOGFILE}`);

export const loggerInfo = (message: string) => {
    if (!fs.existsSync(LOGFILE)) {
        fs.mkdirSync(getAppDataPath(), { recursive: true });
        fs.writeFileSync(LOGFILE, '');
    }
    fs.appendFileSync(LOGFILE, `${message}${EOL}`);
};
