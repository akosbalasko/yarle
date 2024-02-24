import * as fs from 'fs';

import { YarleOptions } from './../YarleOptions';

import { NoteData, ReplaceType } from './../models';

export const replacePostProcess = (options: YarleOptions, data: NoteData, replaceType: ReplaceType): NoteData => {
    const clonedData = {...data}
    const replaceOptions = options.contentReplacementSettings?.filter(option => option.type === replaceType);
    if (!replaceOptions || replaceOptions.length === 0 )
        return data;


        for (const replaceOption of replaceOptions){
            const regexp = new RegExp(replaceOption.regex, 'g');
            clonedData[replaceType] = clonedData[replaceType].replace(regexp, replaceOption.replace);

        }
    return clonedData;
}