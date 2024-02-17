
import { OutputFormat } from "./../output-format"
export interface LanguageItems {
    
    bold?: string;
    italic?: string;
    highlight?: string;
    strikethrough?: string; 
    listItem?: string;       
}
/*
const languageItems: any = { 
}
languageItems[OutputFormat.ObsidianMD] = { 
    bold: '**',
    italic: '_',
    highlight: '==',
    strikethrough: '~~',
    listItem: '* '
}
languageItems[OutputFormat.Heptabase] = { 
    bold: '**',
    italic: '_',
    highlight: '==',
    strikethrough: '~~',
    listItem: '* '         
}
languageItems[OutputFormat.Tana] = {
    bold: '**',
    italic: '__',
    highlight: '^^',
    strikethrough: '~~', 
    listItem: ''
}

languageItems[OutputFormat.StandardMD] = {
    bold: '**',
    italic: '_',
    highlight: '`',
    strikethrough: '~~', 
    listItem: '* '
}

export const getLanguageItems = (language: OutputFormat): any => {
    return languageItems[language] || languageItems[OutputFormat.StandardMD]
}*/