import * as fs from 'fs';
import * as path from 'path';
const {EOL} = require('os');

const getAppDataPath = () => {
    switch (process.platform) {
      case "darwin": {
        return path.join(process.env.HOME, "Library", "Application Support", "yarle-evernote-to-md");
      }
      case "win32": {
        return path.join(process.env.APPDATA, "yarle-evernote-to-md");
      }
      case "linux": {
        return path.join(process.env.HOME, ".yarle-evernote-to-md");
      }
      default: {
        console.log("Unsupported platform!");
        process.exit(1);
      }
    }
  }

export const LOGFILE =  path.join(getAppDataPath(),'/conversion.log');
console.log(`logfilepath: ${LOGFILE}`);


export const loggerInfo = (message: string) => {
    
    fs.appendFileSync(LOGFILE, `${message}${EOL}`);
}

