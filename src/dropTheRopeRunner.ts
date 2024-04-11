/* istanbul ignore file */
// tslint:disable:no-console

import * as fs from 'fs';
import * as path from 'path';
import { omit } from 'lodash';

import * as yarle from './yarle';
import { YarleOptions } from './YarleOptions';
import { loggerInfo } from './utils/loggerInfo';
import { clearLogFile } from './utils/clearLogFile';
import { applyLinks } from './utils/apply-links';
import { LanguageFactory } from './outputLanguages/LanguageFactory';
import { recursiveReaddirSync } from './utils/file-utils';

export const run = async (opts?: YarleOptions) => {
    clearLogFile();
    // tslint:disable-next-line:no-require-imports
    const argv = require('minimist')(process.argv.slice(2));
    const configFile = argv['configFile']
        ? path.isAbsolute(argv['configFile'])
            ? argv['configFile']
            : `${process.cwd()}/${argv['configFile']}`
        : `${__dirname}/../config.json`;
    const argOptions = omit(argv, 'configFile', '_')
    if (typeof argOptions.enexSources === 'string') {
        argOptions.enexSources = [argOptions.enexSources]
    }
    console.log(`Loading config from ${configFile}`);
    const options: YarleOptions = { ...require(configFile), ...argOptions, ...opts };

    const isEnexFile = (path: string) => path.toLowerCase().endsWith('.enex')
    options.enexSources = options.enexSources.reduce((arr, source) => {
        if (isEnexFile(source)) {
            arr.push(source)
        } else {
            arr.push(...[...recursiveReaddirSync(source)]
                .filter(isEnexFile))
        }
        return arr
    }, [] as string[])
    loggerInfo(`Converting notes in files: ${options.enexSources}`);

    const outputNotebookFolders = await yarle.dropTheRope(options);

    // POSTPROCESSES 
    // apply internal links
    applyLinks(options, outputNotebookFolders);

    const langaugeFactory = new LanguageFactory();
    const targetLanguage = langaugeFactory.createLanguage(options.outputFormat)
    await targetLanguage.postProcess(options, outputNotebookFolders)
};
