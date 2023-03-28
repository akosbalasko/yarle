import { YarleOptions } from "./../YarleOptions";
import { getAllFiles } from "./get-all-output-files";

export const createTanaOutput = (options: YarleOptions, outputNotebookFolders: Array<string>): void => {
    const allconvertedFiles: Array<string> = [];
    for (const outputFolder of outputNotebookFolders){
        getAllFiles(outputFolder, allconvertedFiles);
    }
}