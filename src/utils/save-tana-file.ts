import { TanaIntermediateFile } from 'tana-import-tools';
import { RuntimePropertiesSingleton } from './../runtime-properties';
import { writeFile } from './file-utils';
import { getJsonFilePath } from './folder-utils';
import { loggerInfo } from './loggerInfo';

export const saveTanaFile = (tanaNote: TanaIntermediateFile, note: any) => {

    const absJsonFilePath = getJsonFilePath(note);
    const runtimeProps = RuntimePropertiesSingleton.getInstance();
    runtimeProps.setCurrentNotePath(absJsonFilePath);
    writeFile(absJsonFilePath, JSON.stringify(tanaNote), note);
    loggerInfo(`Note saved to ${absJsonFilePath}`);
};
