export interface LanguageItems {
    
    bold?: string;
    italic?: string;
    highlight?: string;
    strikethrough?: string; 
    listItem?: string;       
}

export interface Language {
    languageItems: LanguageItems;
    postProcess: Function;
    noteProcess: Function;
    tagProcess: Function;
    noteExtension: string;
    codeBlock: string;
}