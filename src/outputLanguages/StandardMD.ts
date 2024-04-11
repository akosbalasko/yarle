import { cloneDeep } from "lodash";
import { EvernoteNoteData, NoteData } from "./../models/NoteData";
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
    noteProcess= (options: YarleOptions, noteData: NoteData, note: EvernoteNoteData)  => {

        saveMdFile(fixImagesInLink(noteData.appliedMarkdownContent), noteData)
    };
    tagProcess= (content: string, tasks: Map<string, string>, currentTaskPlaceholder: string, updatedContent: string): string => {
        return updatedContent;
    }

}


const fixImagesInLink = (content: string):string => {
    let updatedContent = cloneDeep(content);
    // Regular expression for the whole string with two groups
    const patternWholeString = /\[!\[\[(.*?)(?:\|(.*?))?\]\]\]\((.*?)\)/g;
  
    let match;
    while ((match = patternWholeString.exec(content)) !== null) {
      const bracketContent = match[1];
      const dimensions = match[2] || ''; // Use empty string if dimensions are not present
      const parenthesesContent = match[3];
        updatedContent = (dimensions === "")
          ? updatedContent.replace(`[![[${bracketContent}]]](${parenthesesContent})`, `![${parenthesesContent}](${bracketContent})`)
          : updatedContent.replace(`[![[${bracketContent}|${dimensions}]]](${parenthesesContent})`, `![${parenthesesContent}\\|${dimensions}](${bracketContent})`)
  
    }
    return updatedContent;
  } 