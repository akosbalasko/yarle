import { YarleOptions } from "./../YarleOptions";
import { EvernoteNoteData, NoteData } from "./../models";

export interface LanguageItems {
    
    bold?: string;
    italic?: string;
    highlight?: string;
    strikethrough?: string; 
    listItem?: string;       
}

export interface Language {
    languageItems: LanguageItems;
    postProcess: Function;
    noteProcess: (options: YarleOptions, noteData: NoteData, note: EvernoteNoteData) => void;
    tagProcess: Function;
    noteExtension: string;
    codeBlock: string;
}