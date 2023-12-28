/* istanbul ignore file */
// tslint:disable:no-console

import * as fs from 'fs';
import * as path from 'path';

import * as yarle from './yarle';
import { YarleOptions } from './YarleOptions';
import { loggerInfo } from './utils/loggerInfo';
import { clearLogFile } from './utils/clearLogFile';
import { applyLinks } from './utils/apply-links';
import { LanguageFactory } from './outputLanguages/LanguageFactory';

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
    } else {
        const enexFiles = fs
            .readdirSync(options.enexSources[0])
            .filter((file: any) => {
                return file.match(/.*\.enex/ig);
            });

        options.enexSources = enexFiles.map(enexFile => `${options.enexSources[0]}${path.sep}${enexFile}`);
    }
    const outputNotebookFolders = await yarle.dropTheRope(options);

    // POSTPROCESSES 
    // apply internal links
    applyLinks(options, outputNotebookFolders);

    const langaugeFactory = new LanguageFactory();
    const targetLanguage = langaugeFactory.createLanguage(options.outputFormat)
    await targetLanguage.postProcess(options, outputNotebookFolders)
};
