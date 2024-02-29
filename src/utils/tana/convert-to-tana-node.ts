import { NoteData } from "../../models"
import { NodeType, TanaIntermediateFile, TanaIntermediateNode } from "./types"
import { RuntimePropertiesSingleton } from '../../runtime-properties';
import { checkboxDone, checkboxTodo, tanaCodeBlock, tanaTableBlock, tanaTableColBlock, tanaTableRowBlock } from "../../constants";
import { createNewTanaFile } from "./create-new-tana-file";
import { createTanaNode } from "./create-tana-node";

export const cleanTanaContent = (content: string, valueToClean: string):string => {
    return content.replace(valueToClean, '')
}

const convertString2TanaNode = (content: string, data: NoteData, addTags: boolean = false): TanaIntermediateNode => {
    const linkNameMap = RuntimePropertiesSingleton.getInstance();
    const link = linkNameMap.getNoteIdNameMapByNoteTitle(content);
    const uid = link && link[0] ? link[0].uniqueEnd : 'uuid' + Math.random()

    const tanaNode: TanaIntermediateNode = createTanaNode('node' as NodeType, content, data, uid);
    if (addTags){
        const tags = JSON.parse(data.tags)
        tanaNode.supertags = tags
    }
    return tanaNode
}
const convertString2TanaCheckbox = (content: string, todoState: string, data: NoteData): TanaIntermediateNode => {
    const checkboxNode = createTanaNode(
        'node' as NodeType,
        cleanTanaContent(content, todoState === 'todo' ? checkboxTodo: checkboxDone),
        data, undefined)
    checkboxNode.todoState = todoState as "todo"|"done"
    return checkboxNode;

}
const convertString2TanaCodeblock = (content: string, data: NoteData): TanaIntermediateNode => {
    return createTanaNode('codeblock' as NodeType, cleanTanaContent(content, tanaCodeBlock), data, undefined);

}
const splitAndCleanArray = (content: string, splitBy: string): Array<string> => {
    return content.split(splitBy).filter(contentElem => contentElem !== '');
}
const convertString2TanaTable = (content: string, data: NoteData): TanaIntermediateNode => {

    const mainTableNode: TanaIntermediateNode = createTanaNode('node' as NodeType, 'Table', data, undefined);

    const rows = splitAndCleanArray(content, tanaTableRowBlock)
    const columns: Array<TanaIntermediateNode> = [];
    for (const [rowIndex, row] of rows.entries()){

        const cols = splitAndCleanArray(row, tanaTableColBlock)

        if (rowIndex === 0){

            // create fields for this first row
            for (const col of cols){

                columns.push(createTanaNode('field' as NodeType, col, data, undefined))
            }
        }
        else {
            let rowNode: TanaIntermediateNode;
        for (const [index, col] of cols.entries()) {
            if (index === 0){
                const rowItems = row.split(tanaTableColBlock)
                rowNode = createTanaNode('node' as NodeType, rowItems && rowItems.length >= 1 ? rowItems[1]:'', data, undefined); 
            } else {
                const cellNode: TanaIntermediateNode = createTanaNode('node' as NodeType, col, data, undefined);
                const columnField = {...columns[index], uid: 'uid' + Math.random()}
                columnField.children = [];
                columnField.children.push(cellNode)
                rowNode.children.push(columnField)
            }
            //rowNode.children.push(cellNode)

        }
            mainTableNode.children.push(rowNode)

        }

    }
    return mainTableNode
}
export const convertChild = (data: NoteData, child: string) => {
    // if it is a link
    const regex = /\evernote:\/\/[^)]*\)/g;
    const found = child.match(regex);
    const linkNameMap = RuntimePropertiesSingleton.getInstance();

    let convertedChild = child.includes(tanaCodeBlock)
        ? convertString2TanaCodeblock(child, data)
        : convertString2TanaNode(child, data)
    if (child.startsWith(checkboxTodo))
        convertedChild =  convertString2TanaCheckbox(child, 'todo', data)
    if (child.startsWith(checkboxDone))
        convertedChild =  convertString2TanaCheckbox(child, 'done', data)
    if (child.startsWith(tanaTableBlock))
        convertedChild = convertString2TanaTable(child.replace(new RegExp(tanaTableBlock, 'g'), ''), data)
    if (found && found.length > 0){
        for (const link of found){
            const pureLink = link.slice(0, -1)
            const linkItem = linkNameMap.getNoteIdNameMap()[pureLink];
            convertedChild.refs.push(linkItem.uniqueEnd);
            convertedChild.name = convertedChild.name.replace(pureLink,`[[${linkItem.uniqueEnd}]]`)
                
        }

    } 
    return convertedChild
}

export const convert2TanaNode = (data: NoteData):TanaIntermediateFile => {
    const firstLevelChildren = data.appliedMarkdownContent.replace(/(\n|\r\n)+/g, '\n').split('\n')
    
    const rootContent = data.title
    
    const childrenNodes: Array<TanaIntermediateNode> = [];
    const parentCandidates: Array<TanaIntermediateNode> = []
    const levelRecognizerRegexp = new RegExp("^\t+")

    for (const child of firstLevelChildren){
        const matchedLevel = child.match(levelRecognizerRegexp)
        const convertedChild = convertChild(data, child)

        const deepLevel = matchedLevel?.[0] ? matchedLevel?.[0].split('').length : 0;
        if (deepLevel > 0) {
            convertedChild.name = convertedChild.name.replace(levelRecognizerRegexp, '')
            parentCandidates[deepLevel-1].children.push(convertedChild)
        }
        else childrenNodes.push(convertedChild)
        parentCandidates[deepLevel] = convertedChild


    }
    const  tif: TanaIntermediateFile = {
        ...createNewTanaFile(),
        nodes: [{
            ...convertString2TanaNode(rootContent, data, data.tags? true: false),
            children: childrenNodes,
         
        }],
        summary: {
            leafNodes: childrenNodes.filter(child => child.children?.length === 0).length,
            topLevelNodes: 0,
            totalNodes: childrenNodes.length+1,
            calendarNodes: 0,
            fields: 0,
            brokenRefs: 0,
        }
    }

    if (data.tags){
        const tags = JSON.parse(data.tags)
        const superTags = tags.map((tag: any) => { return {uid: tag, name: tag}})
        tif.supertags = superTags
    }
    return tif;
}