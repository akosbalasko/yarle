/* istanbul ignore file */
// tslint:disable:no-console

import * as fs from 'fs';
import * as path from 'path';

import * as yarle from './yarle';
import { YarleOptions } from './YarleOptions';
import { loggerInfo } from './utils/loggerInfo';
import { clearLogFile } from './utils/clearLogFile';

export const run = async (opts?: YarleOptions) => {
    clearLogFile();
    var argv = require('minimist')(process.argv.slice(2));
    let configFile = argv['configFile']
        ? path.isAbsolute(argv['configFile'])
            ? argv['configFile']
            : `${process.cwd()}/${argv['configFile']}`
        :`${__dirname}/../config.json`;
    console.log(`Loading config from ${configFile}`);
    const options: YarleOptions = {...require(configFile),...opts};
    if (options.enexSource.endsWith('.enex')) {
        loggerInfo(`Converting notes in file: ${options.enexSource}`);
        await yarle.dropTheRope(options);

    } else {
        const enexDir = options.enexSource;
        const enexFiles = fs
            .readdirSync(enexDir)
            .filter((file:any) => {
                return file.match(/.*\.enex/ig);
            });
        for (const enexFile of enexFiles) {
            options.enexSource = `${enexDir}/${enexFile}`;
            loggerInfo(`Converting notes in file: ${enexFile}`);
            await yarle.dropTheRope(options);

        }
    }
};
