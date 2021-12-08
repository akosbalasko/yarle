import { InternalLink, NoteData } from './models';

export class RuntimePropertiesSingleton {

    static instance: RuntimePropertiesSingleton;

    noteIdNameMap: any;
    noteIdNameTOCMap: any; // Table of Contents map - the trusted source
    currentNoteName: string;
    currentNotebookName: string;

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
        this.noteIdNameMap[linkItem.url] = {
            ...this.noteIdNameMap[linkItem.url],
            title: linkItem.title,
            noteName: this.currentNoteName,
            notebookName: this.currentNotebookName,
        };
    }
    addItemToTOCMap(linkItem: InternalLink): void {
        this.noteIdNameTOCMap[linkItem.url] = {
            ...this.noteIdNameMap[linkItem.url],
            title: linkItem.title,
            noteName: this.currentNoteName,
            notebookName: this.currentNotebookName,
        };
    }

    getNoteIdNameMap(): any {
        return this.noteIdNameMap;
    }

    getNoteIdNameTOCMap(): any {
        return this.noteIdNameTOCMap;
    }

    getAllNoteIdNameMap(): any {
        return {
            ...this.noteIdNameMap,
            ...this.noteIdNameTOCMap,
        };
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
}
