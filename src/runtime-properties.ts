import { cloneDeep } from 'lodash';
import { InternalLink, NoteData } from './models';
export interface NoteIdNameEntry {
    title: string;
    noteName: string;
    notebookName: string;
    uniqueEnd: string;
    url: string,
    guid: string,
}

export interface NoteIdNames {
 [key: string]: NoteIdNameEntry;
}

const getGuid = (linkItem: InternalLink): string => {
    const linkSpl = cloneDeep(linkItem.url).split('/').reverse().filter(item => !!item)
    return (linkSpl.length > 1)
        ? linkSpl[1]
        : linkSpl[0]
}
export class RuntimePropertiesSingleton {

    static instance: RuntimePropertiesSingleton;

    noteIdNameMap: NoteIdNames;
    noteIdNameTOCMap: NoteIdNames; // Table of Contents map - the trusted source
    currentNoteName: string;
    currentNotebookName: string;
    currentNotePath: string;

    private constructor() {
        this.noteIdNameMap = {};
        this.noteIdNameTOCMap = {};

    }

    static getInstance(): RuntimePropertiesSingleton {
        if (!RuntimePropertiesSingleton.instance) {
            RuntimePropertiesSingleton.instance = new RuntimePropertiesSingleton();
        }

        return RuntimePropertiesSingleton.instance;
    }

    addItemToMap(linkItem: InternalLink): void {

        this.noteIdNameMap[linkItem.id] = {
            ...this.noteIdNameMap[linkItem.id],
            url: linkItem.url,
            guid: getGuid(linkItem),
            title: linkItem.title,
            noteName: this.currentNoteName,
            notebookName: this.currentNotebookName,
            uniqueEnd: linkItem.uniqueEnd,

        };
    }
    addItemToTOCMap(linkItem: InternalLink): void {
        
        this.noteIdNameTOCMap[linkItem.id] = {
            ...this.noteIdNameMap[linkItem.id],
            title: linkItem.title,
            url: linkItem.url,
            guid: getGuid(linkItem),
            noteName: this.currentNoteName,
            notebookName: this.currentNotebookName,
            uniqueEnd: linkItem.uniqueEnd,
        };
    }

    getNoteIdNameMap(): any {
        return this.noteIdNameMap;
    }

    getNoteIdNameTOCMap(): any {
        return this.noteIdNameTOCMap;
    }

    getAllNoteIdNameMap(): NoteIdNames {
        return {
            ...this.noteIdNameMap,
            ...this.noteIdNameTOCMap,
        };
    }

    getNoteIdNameMapByNoteTitle(noteTitle: string): any {
        return Object.values(this.getAllNoteIdNameMap()).filter(noteIdName => noteIdName.title === noteTitle);
    }

    setCurrentNotebookName(currentNotebookName: string): void {
        this.currentNotebookName = currentNotebookName;
    }

    setCurrentNoteName(currentNoteName: string): void {
        this.currentNoteName = currentNoteName;
    }
    getCurrentNoteName(): string {
        return this.currentNoteName;
    }
    getCurrentNotePath(): string {
        return this.currentNotePath;
    }

    setCurrentNotePath(value: string): void {
        this.currentNotePath = value;
    }

}
