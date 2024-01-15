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
import { updateFileContentSafely } from './file-utils';
import { getClosestFileName } from './filename-utils';
import { TOCNoteName } from './../constants'

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
        if (options.useLevenshteinForLinks){
            const fileNames = allconvertedFiles.map(convertedFileName => {
                return convertedFileName.split(path.sep).reverse()[0].split('.')[0]
            })
            fileName = getClosestFileName(fileName, fileNames);
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
                
                if ((`${fileName}.md` === targetFile || targetFile === linkProps.title) &&
                    linkProps.noteName === TOCNoteName &&
                    notebookFolder.endsWith(notebookName)){
                    // TODO APPLY EVERNOTE LINK 
                    const evernoteInternalLinkPlaceholderRegExp = new RegExp('<YARLE_EVERNOTE_LINK_PLACEHOLDER>', 'g');
                    updatedContent = updatedContent.replace(evernoteInternalLinkPlaceholderRegExp, (linkProps as any)['url']);


                    // TODO APPLY EVERNOTE GUID 
                    const evernoteGuidPlaceholderRegExp = new RegExp('<YARLE_EVERNOTE_GUID_PLACEHOLDER>', 'g');
                    updatedContent = updatedContent.replace(evernoteGuidPlaceholderRegExp, (linkProps as any)['guid']);
                }
                if (fileContent !== updatedContent) {
                    const filePath = `${notebookFolder}${path.sep}${targetFile}`;
                    updateFileContentSafely(filePath, updatedContent);
                    
                }
            }
        }
    }
};

