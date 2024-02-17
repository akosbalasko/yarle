import { OutputFormat } from "./../output-format";
import { Language } from "./language";
import { ObsidianMD } from "./ObsidianMD";
import { StandardMD } from "./StandardMD";
import { Heptabase } from "./Heptabase";
import { Tana } from "./Tana"; 

import { LanguageItems } from "./outputLanguages";

export class LanguageFactory {
    createLanguage(type: OutputFormat): Language {
        switch (type) {
            case OutputFormat.ObsidianMD:
                return new ObsidianMD();
            case OutputFormat.Heptabase:
                return new Heptabase();
            case OutputFormat.Tana:
                return new Tana();
            default:
                return new StandardMD();
        }
    }
}

export const getLanguageItems = (language: OutputFormat): LanguageItems => {
    const factory = new LanguageFactory();
    const lang = factory.createLanguage(language);
    return lang.languageItems;
}