import { ImageSizeFormat } from 'image-size-format';
import { CharacterMap } from './../CharacterMap';
import { YarleOptions } from './../YarleOptions';
import { OutputFormat } from './../output-format';
import { TaskOutputFormat } from './../task-output-format';
import { SearchAndReplace } from 'models';

const store = require ('./store');
enum DefaultRootType {
    array = 'array',
    object = 'object'

}
const loadJSONSafely = (jsonString: string, defaultRootTyoe: DefaultRootType): any => {
    try {
        console.log(jsonString);
        return JSON.parse(jsonString);
    }catch(e){
        console.log("ERROR", e);
        return defaultRootTyoe === DefaultRootType.array
            ? []
            : {}
    }
}
export const mapSettingsToYarleOptions = (): YarleOptions => {
    return {
        enexSources: store.get('enexSources') as Array<string>,
        outputDir: store.get('outputDir') as string,
        isMetadataNeeded: true,
        isNotebookNameNeeded: store.get('isNotebookNameNeeded') as boolean,
        isZettelkastenNeeded: store.get('isZettelkastenNeeded') as boolean,
        useZettelIdAsFilename: store.get('useZettelIdAsFilename') as boolean,
        plainTextNotesOnly: store.get('plainTextNotesOnly') as boolean,
        skipWebClips: (store.get('skipWebClips') as boolean),
        useHashTags: store.get('useHashTags') as boolean,
        outputFormat: store.get('outputFormat') as OutputFormat,
        obsidianTaskTag: store.get('obsidianTaskTag') as string,
        taskOutputFormat: store.get('taskOutputFormat') as TaskOutputFormat,
        skipEnexFileNameFromOutputPath: store.get('skipEnexFileNameFromOutputPath') as boolean,
        keepMDCharactersOfENNotes: store.get('keepMDCharactersOfENNotes') as boolean,
        monospaceIsCodeBlock: store.get('monospaceIsCodeBlock') as boolean,
        keepOriginalHtml: store.get('keepOriginalHtml') as boolean,
        posixHtmlPath: store.get('posixHtmlPath') as boolean,
        currentTemplate: store.get('currentTemplate') as string,
        resourcesDir: store.get('resourcesDir') as string,
        trimStartingTabs: store.get('trimStartingTabs') as boolean,
        convertPlainHtmlNewlines: store.get('convertPlainHtmlNewlines') as boolean,
        removeUnicodeCharsFromTags: store.get('removeUnicodeCharsFromTags') as boolean,
        encryptionPasswords: ((store.get('encryptionPasswords') as string)||'').split(',').map(pwd => pwd.trim()),
        nestedTags: {
            separatorInEN: store.get('nestedTags.separatorInEN') as string,
            replaceSeparatorWith: store.get('nestedTags.replaceSeparatorWith') as string,
            replaceSpaceWith: store.get('nestedTags.replaceSpaceWith') as string,
        },
        logseqSettings: {
            journalNotes: store.get('logseqSettings.journalNotes') as boolean,
        },
        obsidianSettings: {
            omitLinkDisplayName: store.get('obsidianSettings.omitLinkDisplayName') as boolean,
        },
        dateFormat: store.get('dateFormat') as string,
        imageSizeFormat: store.get('imageSizeFormat') as ImageSizeFormat,
        keepImageSize: store.get('keepImageSize') as boolean,
        keepOriginalAmountOfNewlines: store.get('keepOriginalAmountOfNewlines') as boolean,
        addExtensionToInternalLinks: store.get('addExtensionToInternalLinks') as boolean,
        generateNakedUrls: store.get('generateNakedUrls') as boolean,
        urlEncodeFileNamesAndLinks: store.get('urlEncodeFileNamesAndLinks') as boolean,
        haveEnexLevelResources: store.get('haveEnexLevelResources') as boolean,
        haveGlobalResources: store.get('haveGlobalResources') as boolean,
        useUniqueUnknownFileNames: store.get('useUniqueUnknownFileNames') as boolean,
        useLevenshteinForLinks: store.get('useLevenshteinForLinks') as boolean,
        convertColorsToMDHighlight: store.get('convertColorsToMDHighlight') as boolean,
        keepEvernoteLinkIfNoNoteFound: store.get('keepEvernoteLinkIfNoNoteFound') as boolean,
        sanitizeResourceNameSpaces: store.get('sanitizeResourceNameSpaces') as boolean,
        replacementChar: store.get('replacementChar') as string,
        replacementCharacterMap: loadJSONSafely(store.get('replacementCharacterMap'), DefaultRootType.object) as CharacterMap,
        globalReplacementSettings: loadJSONSafely(store.get('globalReplacementSettings'), DefaultRootType.array) as Array<SearchAndReplace>
    };
};
