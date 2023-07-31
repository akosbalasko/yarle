import * as fs from 'fs';
import * as _ from 'lodash'; 
import { YarleOptions } from "../../YarleOptions";
import { getAllOutputFilesWithExtension } from "../get-all-output-files";
import { NodeType, TanaIntermediateAttribute, TanaIntermediateFile, TanaIntermediateNode } from "./types";
import { createNewTanaFile } from './create-new-tana-file';
import { createTanaNode } from './create-tana-node';
const tanaNoteFileName = 'notes-in-TIF.json';

export const createTanaOutput = (options: YarleOptions, outputNotebookFolders: Array<string>): void => {
    const allconvertedFiles: Array<string> = [];
    for (const outputFolder of outputNotebookFolders){
        getAllOutputFilesWithExtension(outputFolder, allconvertedFiles, 'json');
    }
    for (const convertedFile of allconvertedFiles){
        // load and parse mergedTanaNotes, or create if
        const mergedNotes = getMergedTanaNotes(options)
        const convertedTanaNote = JSON.parse(fs.readFileSync(convertedFile, 'UTF-8'))

        updateMergedNotes(mergedNotes, convertedTanaNote)
        saveMergedTanaNotes(options, mergedNotes)
    }
}
const cleanChildren = (nodes: Array<TanaIntermediateNode>): Array<TanaIntermediateNode> => {
    const cleanNodes = _.cloneDeep(nodes)
    for (const node of cleanNodes)
        node.children = []
    return cleanNodes;
} 
const updateMergedNotes = (mergedNotes: TanaIntermediateFile, convertedTanaNote: TanaIntermediateFile): void => {

    mergedNotes.nodes.push(convertedTanaNote.nodes[0])
    const fieldNodes = addFieldNodesToRoot(convertedTanaNote.nodes[0]);
    mergedNotes.attributes.push(...getAttributes(fieldNodes))
    mergedNotes.nodes.push(...cleanChildren(fieldNodes))

    // handling attributes

    //handling supertags
    if(convertedTanaNote.supertags){
        for (const supertag of convertedTanaNote.supertags){
            if (!mergedNotes.supertags.find(mergedSupertag => mergedSupertag.uid === supertag.uid))
                mergedNotes.supertags.push(supertag)
        }
    }
    mergedNotes.summary.leafNodes += convertedTanaNote.summary.leafNodes
    mergedNotes.summary.totalNodes += convertedTanaNote.summary.totalNodes
    mergedNotes.summary.topLevelNodes += 1
    mergedNotes.summary.fields = fieldNodes.length;
}
const getAttributes = (fieldNodes: Array<TanaIntermediateNode>): Array<TanaIntermediateAttribute> => {
    const fieldAttributes: Array<TanaIntermediateAttribute> = [];
    for (const field of fieldNodes){
        for (const valueChild of field.children){
            const storedAttribute = fieldAttributes.find( attribute => attribute.name === field.name)
            if (storedAttribute) {
            storedAttribute.count +=1;
            storedAttribute.values.push(valueChild.name)
            }else {
                fieldAttributes.push(createNewTanaAttribute(field.name, valueChild.name))
            }
        }
    }
    return fieldAttributes;
}

const createNewTanaAttribute = (name: string, value: string): TanaIntermediateAttribute => {
    return {
        name,
        values: [value],
        count: 1,
    }
}
//
const addFieldNodesToRoot = (tanaNode: TanaIntermediateNode): Array<TanaIntermediateNode> => {
    const fields:Array<TanaIntermediateNode> = []
    deepFind([tanaNode], (node:TanaIntermediateNode) => {
        return node.type === 'field' as NodeType;
    }, fields);

    //return fields || []
    const fieldNodes: Array<TanaIntermediateNode> = [];
    for (const field of fields) {
        const foundField = fieldNodes.find(fieldNode => fieldNode.name === field.name)
        if (foundField){
            field.refs.push(foundField.uid)
            foundField.children.push(...field.children)
        }
        else {
            const node = createTanaNode('node' as NodeType, field.name, { createdAt: ''+new Date(field.createdAt).toISOString().slice(0, 10), updatedAt: ''+new Date(field.editedAt).toISOString().slice(0, 10), }, undefined);
            node.children =[...field.children]
            fieldNodes.push(node)
            field.refs.push(node.uid)
        }
    }

    return fieldNodes;

}
const deepFind = (arr: Array<TanaIntermediateNode>, searchFuncion: Function, fields: Array<TanaIntermediateNode>): void => {
    for(const obj of arr) {
        if(searchFuncion(obj)) {
            fields.push(obj);
        }
        if(obj.children) {
            deepFind(obj.children, searchFuncion, fields);
            
        }
    }
    return null;
}
const getMergedTanaNotes = (options: YarleOptions): TanaIntermediateFile => {

    let mergedTanaNote
    try {
        mergedTanaNote = JSON.parse(fs.readFileSync(`${options.outputDir}/${tanaNoteFileName}`, 'UTF-8'))
    }catch(error){
        mergedTanaNote = createNewTanaFile()
    }
    return mergedTanaNote

}
const saveMergedTanaNotes  = (options: YarleOptions, mergedNotes: TanaIntermediateFile): void => {
    fs.writeFileSync(`${options.outputDir}/${tanaNoteFileName}`, JSON.stringify(mergedNotes))
}
