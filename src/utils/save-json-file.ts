import { TanaIntermediateFile } from "./tana/types";
import { RuntimePropertiesSingleton } from './../runtime-properties';
import { writeFile } from './file-utils';
import { getJsonFilePath } from './folder-utils';
import { loggerInfo } from './loggerInfo';

export const saveJsonFile = (jsonNote: any, note: any) => {

    const absJsonFilePath = getJsonFilePath(note);
    const runtimeProps = RuntimePropertiesSingleton.getInstance();
    runtimeProps.setCurrentNotePath(absJsonFilePath);
    writeFile(absJsonFilePath, JSON.stringify(jsonNote), note);
    loggerInfo(`Note saved to ${absJsonFilePath}`);
};
