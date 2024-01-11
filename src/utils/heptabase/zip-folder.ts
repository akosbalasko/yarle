import * as path from 'path';

import { YarleOptions } from "../../YarleOptions";
import { zip } from 'zip-a-folder';

export const zipFolder = async(options: YarleOptions, outputNotebookFolders: Array<string>): Promise<void> => {
    for (const outputFolder of outputNotebookFolders)
        await zip(outputFolder, `${outputFolder}.zip`);
}