/* istanbul ignore file */
// tslint:disable:no-console

import * as fs from 'fs';

import * as yarle from './yarle';
import { YarleOptions } from './YarleOptions';
import { logger } from './utils/logger';

export const run = async (opts?: YarleOptions) => {
    var argv = require('minimist')(process.argv.slice(2));
    let configFile = argv['configFile'] ? `${process.cwd()}/${argv['configFile']}`:`${__dirname}/../config.json`;
    logger.info(`Loading config from ${configFile}`);
    const options: YarleOptions = {...require(configFile),...opts};
    if (options.enexSource.endsWith('.enex')) {
        logger.info(`Converting notes in file: ${options.enexSource}`);
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
            logger.info(`Converting notes in file: ${enexFile}`);
            await yarle.dropTheRope(options);

        }
    }
};
