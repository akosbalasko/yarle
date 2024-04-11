import { YarleOptions } from "./../YarleOptions"
import { ReplaceType } from "./../models"


export const regexpProcess = (options: YarleOptions, inputString: string, replaceType: ReplaceType): string => {
    if (!inputString)
        return inputString;
    let cloneString = inputString.slice();
    const replaceOptions = options.globalReplacementSettings?.filter(option => option.type === replaceType);
    if (!replaceOptions || replaceOptions.length === 0 )
        return inputString;


        for (const replaceOption of replaceOptions){
            const regexp = new RegExp(replaceOption.regex, 'g');
            cloneString = cloneString.replace(regexp, replaceOption.replace);

        }
    return cloneString;
}

export const performRegexpOnTitle = (options: YarleOptions, title: string): string => {
    return regexpProcess(options, title, ReplaceType.title);
}

export const performRegexpOnContent = (options: YarleOptions, content: string): string => {
    return regexpProcess(options, content, ReplaceType.content);
}