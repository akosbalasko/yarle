import { YarleOptions } from "./../YarleOptions";
import { Language } from "./language";
import { zipFolder } from "./../utils/heptabase/zip-folder";
import { StandardMD } from "./StandardMD";

export class Heptabase extends StandardMD implements Language  {
    constructor(){
        super()
    }

    languageItems =  {
        bold: '**',
        italic: '_',
        highlight: '==',
        strikethrough: '~~',
        listItem: '* '   
    };
    postProcess = async(options: YarleOptions, outputNotebookFolders: string[]) => {
        await zipFolder(options, outputNotebookFolders)
    };

}