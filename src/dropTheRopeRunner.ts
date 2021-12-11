/* istanbul ignore file */
// tslint:disable:no-console

import * as fs from 'fs';
import * as path from 'path';

import * as yarle from './yarle';
import { YarleOptions } from './YarleOptions';
import { loggerInfo } from './utils/loggerInfo';
import { clearLogFile } from './utils/clearLogFile';
import { RuntimePropertiesSingleton } from './runtime-properties';

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

    // apply internal links
    const linkNameMap = RuntimePropertiesSingleton.getInstance();
    const allLinks = linkNameMap.getAllNoteIdNameMap();
    for (const [linkName, linkProps] of Object.entries(allLinks)) {
        const fileName: string = (linkProps as any)['title'];
        const notebookName: string = (linkProps as any)['notebookName'];
        const encodedFileName = options.urlEncodeFileNamesAndLinks ? encodeURI(fileName as string) : fileName as string;

        for (const notebookFolder of outputNotebookFolders) {
            let realFileName = encodedFileName;
            let realFileNameInContent = encodedFileName;
            if (notebookName && !notebookFolder.endsWith(notebookName)) {
                realFileName = `${notebookName}${encodedFileName}`;
                realFileNameInContent = `${notebookName}/${encodedFileName}`;
            }
            const filesInOutputDir = fs.readdirSync(notebookFolder);
            console.log(`Files in output dir: ${JSON.stringify(filesInOutputDir)}`);
            console.log(`notebookFolder: ${notebookFolder}`);
            console.log(`realFileName: ${realFileName}`);

            const extension = '.md';

            const targetFiles = filesInOutputDir.filter(file => {
                return path.extname(file).toLowerCase() === extension;
            });
            for (const targetFile of targetFiles) {
                const fileContent = fs.readFileSync(`${notebookFolder}${path.sep}${targetFile}`, 'UTF-8');
                const escapedLinkName = escapeEntity(linkName);
                const regexp = new RegExp(escapedLinkName, 'g');
                const updatedContent = fileContent.replace(regexp, realFileNameInContent);
                if (fileContent !== updatedContent) {
                    console.log(`replaced output written to: ${notebookFolder}${path.sep}${targetFile}`);
                    fs.writeFileSync(`${notebookFolder}${path.sep}${targetFile}`, updatedContent);
                }
            }
        }
    }
};

const escapeEntity = (entity: string): string => {
    return entity.replace(/\//g, '\\/');
};
