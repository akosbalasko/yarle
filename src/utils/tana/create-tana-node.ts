import { NoteData } from "../../models/NoteData"
import { NodeType, TanaIntermediateNode } from "./types"

export const createTanaNode = (type: NodeType, content: string, data: NoteData, uid: string): TanaIntermediateNode => {
    if (!uid)
        uid = 'uuid' + Math.random()
    return {
        uid,
        createdAt: new Date(data.createdAt).getTime(),
        editedAt: new Date(data.updatedAt).getTime(),
        type,
        name: content,
        refs: [], 
        children: []
    }
}