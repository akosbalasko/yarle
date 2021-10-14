import { NoteData } from './../models';
import { getHtmlFilePath } from '.';
import { writeFile } from './file-utils';

export const saveHtmlFile = (noteData: NoteData, note: any) => {
    if (noteData.htmlContent) {
        const absHtmlFilePath = getHtmlFilePath(note);
        writeFile(absHtmlFilePath, noteData.htmlContent, note);
    }
};
