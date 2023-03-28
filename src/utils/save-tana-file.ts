import { TanaIntermediateFile } from 'tana-import-tools';
import { RuntimePropertiesSingleton } from './../runtime-properties';
import { writeFile } from './file-utils';
import { getMdFilePath } from './folder-utils';
import { loggerInfo } from './loggerInfo';

export const saveTanaFile = (tanaNote: TanaIntermediateFile, note: any) => {

    const absMdFilePath = getMdFilePath(`${note}.tif.json`);
    const runtimeProps = RuntimePropertiesSingleton.getInstance();
    runtimeProps.setCurrentNotePath(absMdFilePath);
    writeFile(absMdFilePath, JSON.stringify(tanaNote), note);
    loggerInfo(`Note saved to ${absMdFilePath}`);
};
