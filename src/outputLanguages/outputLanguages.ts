import { OutputFormat } from "./../output-format"
export interface LanguageItems {
    
    bold?: string;
    italic?: string;
    highlight?: string;
    strikethrough?: string;        
}
const languageItems: any = { 
}
languageItems[OutputFormat.ObsidianMD] = { 
    bold: '**',
    italic: '_',
    highlight: '==',
    strikethrough: '~~',         
}
languageItems[OutputFormat.Heptabase] = { 
    bold: '**',
    italic: '_',
    highlight: '==',
    strikethrough: '~~',         
}
languageItems[OutputFormat.Tana] = {
    bold: '**',
    italic: '__',
    highlight: '^^',
    strikethrough: '~~', 
}

languageItems[OutputFormat.StandardMD] = {
    bold: '**',
    italic: '_',
    highlight: '`',
    strikethrough: '~~', 
}

export const getLanguageItems = (language: OutputFormat): any => {
    return languageItems[language] || languageItems[OutputFormat.StandardMD]
}