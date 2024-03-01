import { YarleOptions } from "./../YarleOptions";
import { Language } from "./language";
import { createTanaOutput } from "./../utils/tana/create-tana-output";
import { StandardMD } from "./StandardMD";
import { EvernoteNoteData, NoteData } from "./../models/NoteData";
import { cleanTanaContent, convert2TanaNode } from "./../utils/tana/convert-to-tana-node";
import { saveTanaFile } from "./../utils/save-tana-file";
import { NodeType } from "./../utils/tana/types";
import { checkboxDone, checkboxTodo } from './../constants';

export class Tana extends StandardMD implements Language  {
    constructor(){
        super()
    }

    languageItems =  {
        bold: '**',
        italic: '__',
        highlight: '^^',
        strikethrough: '~~', 
        listItem: ''
    };
    codeBlock ='<YARLE_TANA_CODE_BLOCK>';

    postProcess = async (options: YarleOptions, outputNotebookFolders: string[]) => {
        createTanaOutput(options, outputNotebookFolders);
    };
    noteExtension = '.json';
    noteProcess = (options: YarleOptions, data: NoteData, note: EvernoteNoteData) => {
        const tanaJson = convert2TanaNode(data)

        saveTanaFile(tanaJson, note)
    };
    tagProcess = (content: string, tasks: Map<string, string>, currentTaskPlaceholder: string, updatedContent: string): string => {
        const tanaNote = JSON.parse(content);
        const rootTaskChild = tanaNote.nodes?.[0].children?.find((child:any) => child.name === currentTaskPlaceholder)
        if (rootTaskChild){
          for (const taskItem of tasks.values()){
            // split by tasks
            const todoState = taskItem.startsWith(checkboxTodo)? 'todo':'done'
            tanaNote.nodes?.[0].children?.push({
          
                uid: 'uuid' + Math.random(),
                createdAt: rootTaskChild.createdAt,
                editedAt: rootTaskChild.editedAt,
                type: 'node' as NodeType,

                name: cleanTanaContent(taskItem, todoState === 'todo' ? checkboxTodo: checkboxDone),
                todoState: todoState as "todo"|"done",
                refs:[],
            }

            )
          }
        tanaNote.nodes?.[0].children.splice(tanaNote.nodes?.[0].children.indexOf(rootTaskChild), 1)
        return JSON.stringify(tanaNote)
      }
      return updatedContent
    }

}