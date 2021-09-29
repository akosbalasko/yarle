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
    // tslint:disable-next-line:no-require-imports
    const argv = require('minimist')(process.argv.slice(2));
    const configFile = argv['configFile']
        ? path.isAbsolute(argv['configFile'])
            ? argv['configFile']
            : `${process.cwd()}/${argv['configFile']}`
        : `${__dirname}/../config.json`;
    console.log(`Loading config from ${configFile}`);
    const options: YarleOptions = {...require(configFile), ...opts};
    if (options.enexSources.length === 1 && options.enexSources[0].endsWith('.enex')) {
        loggerInfo(`Converting notes in file: ${options.enexSources}`);
        await yarle.dropTheRope(options);

    } else {
        const enexFiles = fs
            .readdirSync(options.enexSources[0])
            .filter((file: any) => {
                return file.match(/.*\.enex/ig);
            });

        options.enexSources = enexFiles.map(enexFile => `${options.enexSources[0]}/${enexFile}`);
        await yarle.dropTheRope(options);
    }
};
