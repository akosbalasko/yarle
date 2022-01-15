/* istanbul ignore file */
// tslint:disable:no-console
import * as fs from 'fs';
import * as path from 'path';

import { YarleOptions } from './../YarleOptions';
import { RuntimePropertiesSingleton } from './../runtime-properties';

export const applyLinks = (options: YarleOptions, outputNotebookFolders: Array<string>): void => {
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
