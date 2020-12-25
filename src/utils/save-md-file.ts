import { writeFile } from './file-utils';
import { getMdFilePath } from "./folder-utils";

export const saveMdFile = (data: any, note: any) => {

    const absMdFilePath = getMdFilePath(note);
    writeFile(absMdFilePath, data, note);
}
