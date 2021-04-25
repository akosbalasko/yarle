import { writeFile } from './file-utils';
import { getMdFilePath } from "./folder-utils";
import { loggerInfo } from './loggerInfo';

export const saveMdFile = (data: any, note: any) => {

    const absMdFilePath = getMdFilePath(note);
    writeFile(absMdFilePath, data, note);
    loggerInfo(`Note saved to ${absMdFilePath}`);
}
