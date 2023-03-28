import { NoteData } from "./../models"
import { NodeType, TanaIntermediateFile, TanaIntermediateNode,TanaIntermediateSummary } from "tana-import-tools"

const convertString2TanaNode = (content: string): TanaIntermediateNode => {
    return {
        uid: 'uuid' + Math.random(),
        createdAt: Date.now(),
        editedAt: Date.now(),
        type: 'node' as NodeType,
        name: content,
    }
}
export const convert2TanaNode = (data: NoteData, node: any):TanaIntermediateFile => {
    const firstLevelChildren = data.content.replace(/\n+/g, '\n').split('\n')
    const rootContent = data.title
    
    const childrenNodes: Array<TanaIntermediateNode> = [];
    for (const child of firstLevelChildren){
        childrenNodes.push(convertString2TanaNode(child))
    }
    const tif: TanaIntermediateFile = {
        version: 'TanaIntermediateFile V0.1',
        nodes: [{
            ...convertString2TanaNode(rootContent),
            children: childrenNodes,  
        }],
        
        summary: {
            leafNodes: childrenNodes.length,
            topLevelNodes: 1,
            totalNodes: childrenNodes.length+1,
            calendarNodes: 0,
            fields: 0,
            brokenRefs: 0,
        }
    }
    return tif;
}