import { NoteData } from "./../models/NoteData";
import { saveMdFile } from "./../utils";
import { YarleOptions } from "./../YarleOptions";
import { Language } from "./language";

export class StandardMD implements Language {
    constructor(){}

    languageItems =  {
        bold: '**',
        italic: '_',
        highlight: '`',
        strikethrough: '~~', 
        listItem: '* '
    };
    codeBlock = '\n```\n';

    postProcess= async(options: YarleOptions, outputNotebookFolders: string[]) => {};
    noteExtension= '.md';
    noteProcess= (data: NoteData, note: any)  => {
        saveMdFile(data.content, note)
    };
    tagProcess= (content: string, tasks: Map<string, string>, currentTaskPlaceholder: string, updatedContent: string): string => {
        return updatedContent;
    }

}