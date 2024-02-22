import { CharacterMap } from 'CharacterMap';
import { TagSeparatorReplaceOptions } from './models';
import { OutputFormat } from './output-format';
import { TaskOutputFormat } from './task-output-format';

export interface YarleOptions {
    enexDir?: string; // used by command line
    enexSources?: Array<string>; // used by the UI
    templateFile?: string;
    currentTemplate?: string;
    outputDir?: string;
    keepOriginalHtml?: boolean;
    posixHtmlPath?: boolean;
    isMetadataNeeded?: boolean;
    isNotebookNameNeeded?: boolean;
    isZettelkastenNeeded?: boolean;
    useZettelIdAsFilename?: boolean;
    plainTextNotesOnly?: boolean;
    skipLocation?: boolean;
    skipCreationTime?: boolean;
    skipUpdateTime?: boolean;
    skipSourceUrl?: boolean;
    skipWebClips?: boolean;
    skipReminderTime?: boolean;
    skipReminderOrder?: boolean;
    skipReminderDoneTime?: boolean;
    skipTags?: boolean;
    useHashTags?: boolean;
    outputFormat?: OutputFormat;
    trimStartingTabs?: boolean;
    convertPlainHtmlNewlines?: boolean;
    encryptionPasswords?: Array<string>;
    logseqSettings?: {
        journalNotes: boolean,
    };
    obsidianSettings?: {
        omitLinkDisplayName?: boolean,
    };
    replaceWhitespacesInTagsByUnderscore?: boolean;
    skipEnexFileNameFromOutputPath?: boolean;
    haveEnexLevelResources?: boolean;
    haveGlobalResources?: boolean;
    keepMDCharactersOfENNotes?: boolean;
    urlEncodeFileNamesAndLinks?: boolean;
    sanitizeResourceNameSpaces?: boolean;
    replacementChar?: string;
    replacementCharacterMap?: CharacterMap;
    monospaceIsCodeBlock?: boolean;
    dateFormat?: string;
    nestedTags?: TagSeparatorReplaceOptions;
    keepImageSize?: OutputFormat;
    keepOriginalAmountOfNewlines?: boolean;
    generateNakedUrls?: boolean;
    addExtensionToInternalLinks?: boolean;
    pathSeparator?: string;
    resourcesDir?: string;
    turndownOptions?: Record<string, any>;
    taskOutputFormat?: TaskOutputFormat;
    obsidianTaskTag?: string;
    useUniqueUnknownFileNames?: boolean;
    useLevenshteinForLinks?: boolean;
    keepFontColors?: boolean;
}
