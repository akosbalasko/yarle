/* istanbul ignore file */
// tslint:disable:no-console
import * as fs from 'fs';
import * as path from 'path';

import { YarleOptions } from './../YarleOptions';
import { RuntimePropertiesSingleton } from './../runtime-properties';
import { truncatFileName } from './folder-utils';
import { escapeStringRegexp } from './escape-string-regexp';
import { getAllOutputFilesWithExtension } from './get-all-output-files';
import { isTanaOutput } from './tana/is-tana-output';

export const applyLinks = (options: YarleOptions, outputNotebookFolders: Array<string>): void => {
    const linkNameMap = RuntimePropertiesSingleton.getInstance();
    const allLinks = linkNameMap.getAllNoteIdNameMap();
    const allconvertedFiles: Array<string> = [];
    for (const outputFolder of outputNotebookFolders){
        getAllOutputFilesWithExtension(outputFolder, allconvertedFiles, undefined);
    }
    for (const [linkName, linkProps] of Object.entries(allLinks)) {
        const uniqueId = linkProps.uniqueEnd;
        let fileName = (linkProps as any)['title'];
        if (allconvertedFiles.find(fn => fn.includes(uniqueId))) {
            fileName = truncatFileName(fileName, uniqueId);
        }

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

            const extension = isTanaOutput() ? '.json': '.md';

            const targetFiles = filesInOutputDir.filter(file => {
                return path.extname(file).toLowerCase() === extension;
            });
            for (const targetFile of targetFiles) {
                const fileContent = fs.readFileSync(`${notebookFolder}${path.sep}${targetFile}`, 'UTF-8');
                let updatedContent = fileContent;
                if (isTanaOutput()){
                    const tanaNote = JSON.parse(updatedContent)
                    const linkedNode  = tanaNote.nodes?.find( (note:any) => note.name === realFileNameInContent)
                    if (linkedNode){
                        const linkItem = linkNameMap.getNoteIdNameMapByNoteTitle(realFileNameInContent)
                        linkedNode.uid = linkItem[0].uniqueEnd
                        updatedContent = JSON.stringify(tanaNote)
                    }

                }
                const regexp = new RegExp(escapeStringRegexp(linkName), 'g');
                updatedContent = updatedContent.replace(regexp, realFileNameInContent);
 

                if (fileContent !== updatedContent) {
                    console.log(`replaced output written to: ${notebookFolder}${path.sep}${targetFile}`);
                    fs.writeFileSync(`${notebookFolder}${path.sep}${targetFile}`, updatedContent);
                }
            }
        }
    }
};

