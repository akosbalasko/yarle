/* istanbul ignore file */
// tslint:disable:no-console

import * as fs from 'fs';

import * as yarle from './yarle';
import { YarleOptions } from './YarleOptions';

export const run = async (opts?: YarleOptions) => {
    var argv = require('minimist')(process.argv.slice(2));
    let configPath = argv['configPath'] ? `${process.cwd()}/${argv['configPath']}`:`${__dirname}/../config.json`;
    console.log(`Loading config from ${configPath}`);
    const options: YarleOptions = {...require(configPath),...opts};
    process.env.YARLEROOTDIR = `${__dirname}/../`;
    if (options.enexSource.endsWith('.enex')) {
        console.log(`Converting notes in file: ${options.enexSource}`);
        options.enexSource = `${__dirname}${options.enexSource}`;
        await yarle.dropTheRope(options);

    } else {
        const enexDir = `${__dirname}${options.enexSource}`;
        const enexFiles = fs
            .readdirSync(`${__dirname}${options.enexSource}`)
            .filter((file:any) => {
                return file.match(/.*\.enex/ig);
            });
        for (const enexFile of enexFiles) {
            options.enexSource = `${enexDir}/${enexFile}`;
            console.log(`Converting notes in file: ${enexFile}`);
            await yarle.dropTheRope(options);

        }
    }
};
