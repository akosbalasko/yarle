import * as fs from 'fs';

import { YarleOptions } from "../../YarleOptions";
import { getAllOutputFilesWithExtension } from "../get-all-output-files";
import { TanaIntermediateFile, TanaIntermediateNode } from "./types";
const tanaNoteFileName = 'notes-converted-in-tana-intermediate-format.json';

export const createTanaOutput = (options: YarleOptions, outputNotebookFolders: Array<string>): void => {
    const allconvertedFiles: Array<string> = [];
    for (const outputFolder of outputNotebookFolders){
        getAllOutputFilesWithExtension(outputFolder, allconvertedFiles, 'json');
    }
    for (const convertedFile of allconvertedFiles){
        // load and parse mergedTanaNotes, or create if
        const mergedNotes = getMergedTanaNotes(options)
        const convertedTanaNote = JSON.parse(fs.readFileSync(convertedFile, 'UTF-8'))

        updateMergedNotes(mergedNotes, convertedTanaNote)
        saveMergedTanaNotes(options, mergedNotes)
    }
}

const updateMergedNotes = (mergedNotes: TanaIntermediateFile, convertedTanaNote: TanaIntermediateFile): void => {

    mergedNotes.nodes.push(convertedTanaNote.nodes[0])
    if(convertedTanaNote.supertags){
        for (const supertag of convertedTanaNote.supertags){
            if (!mergedNotes.supertags.find(mergedSupertag => mergedSupertag.uid === supertag.uid))
                mergedNotes.supertags.push(supertag)
        }
    }
    mergedNotes.summary.leafNodes += convertedTanaNote.summary.leafNodes
    mergedNotes.summary.totalNodes += convertedTanaNote.summary.totalNodes
    mergedNotes.summary.topLevelNodes += 1
}

const getMergedTanaNotes = (options: YarleOptions): TanaIntermediateFile => {

    let mergedTanaNote
    try {
        mergedTanaNote = JSON.parse(fs.readFileSync(`${options.outputDir}/${tanaNoteFileName}`, 'UTF-8'))
    }catch(error){
        mergedTanaNote = createNewTanaFile()
    }
    return mergedTanaNote

}
const saveMergedTanaNotes  = (options: YarleOptions, mergedNotes: TanaIntermediateFile): void => {
    fs.writeFileSync(`${options.outputDir}/${tanaNoteFileName}`, JSON.stringify(mergedNotes))
}
const createNewTanaFile =(): TanaIntermediateFile => {
    return {
        version: 'TanaIntermediateFile V0.1',
        nodes: [],
        supertags: [],
        summary: {
            leafNodes:0,
            topLevelNodes: 1,
            totalNodes: 0,
            calendarNodes: 0,
            fields: 0,
            brokenRefs: 0,
        }
    }
}