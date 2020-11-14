/* istanbul ignore file */
// tslint:disable:no-console

import * as fs from 'fs';

import * as yarle from './yarle';
import { YarleOptions } from './YarleOptions';

export const run = async (opts?: YarleOptions) => {
    const options: YarleOptions = {...require(`${__dirname}/../config.json`),...opts};

    if (options.enexSource.endsWith('.enex')) {
        console.log(`Converting notes in file: ${options.enexSource}`);
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
