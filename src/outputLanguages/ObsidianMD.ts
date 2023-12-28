import { StandardMD } from "./StandardMD";
import { Language } from "./language";

export class ObsidianMD extends StandardMD implements Language  {
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

}