import { NoteData } from './../models';
import { RuntimePropertiesSingleton } from './../runtime-properties';
import { writeFile } from './file-utils';
import { getMdFilePath } from './folder-utils';
import { loggerInfo } from './loggerInfo';

export const saveMdFile = (noteContent: string, note: NoteData) => {

    const absMdFilePath = getMdFilePath(note);
    const runtimeProps = RuntimePropertiesSingleton.getInstance();
    runtimeProps.setCurrentNotePath(absMdFilePath);
    writeFile(absMdFilePath, noteContent, note);
    loggerInfo(`Note saved to ${absMdFilePath}`);
};
