import { MemClient } from "@mem-labs/mem-node";
import { OutputFormat } from "../../output-format"
import { yarleOptions } from "../../yarle"
import { NoteData } from "../../models"
import { MemFile } from "./types"

const memClient = new MemClient({
  apiAccessToken: ""
});


export const transformNotes = async (outputNotebookFolders: string[]) => {}
export const batchMemImport = async (outputNotebookFolders: string[]) => {}
export const isMemOutput = (): boolean => {
    return yarleOptions.outputFormat === OutputFormat.Mem
}

export const convert2MemNode = async (data: NoteData, node: any): Promise<MemFile> => {
    return {
        memId: '',
        content: '',
        createdAt: ''
    }

}