import { cloneDeep } from "lodash";
import { NoteData } from "./../models/NoteData";
import { replacePostProcess, saveMdFile } from "./../utils";
import { YarleOptions } from "./../YarleOptions";
import { Language } from "./language";
import { ReplaceType } from "models";

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
    noteProcess= (options: YarleOptions, data: NoteData, note: any)  => {
        let updatedData = {...data}
        let updatedNote = {...note}
        updatedNote = replacePostProcess(options, updatedNote, ReplaceType.title);
        updatedData = replacePostProcess(options, updatedData, ReplaceType.content);


        saveMdFile(fixImagesInLink(updatedData.content), updatedNote)
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