import { YarleOptions } from './../YarleOptions';
import { store } from './store';
import { OutputFormat } from './../output-format';

export const mapSettingsToYarleOptions = (): YarleOptions => {
    return {
        enexSources: store.get('enexSources') as Array<string>,
        outputDir: store.get('outputDir') as string,
        isMetadataNeeded: true,
        isNotebookNameNeeded: store.get('isNotebookNameNeeded') as boolean,
        isZettelkastenNeeded: store.get('isZettelkastenNeeded') as boolean,
        plainTextNotesOnly: store.get('plainTextNotesOnly') as boolean,
        skipLocation: !(store.get('addLocation') as boolean),
        skipCreationTime: !(store.get('addCreationTime') as boolean),
        skipUpdateTime: !(store.get('addUpdateTime') as boolean),
        skipSourceUrl: !(store.get('addSourceUrl') as boolean),
        skipWebClips: !(store.get('addWebClips') as boolean),
        skipTags: !(store.get('addTags') as boolean),
        useHashTags: store.get('useHashTags') as boolean,
        outputFormat: store.get('outputFormat') as OutputFormat,
        skipEnexFileNameFromOutputPath: store.get('skipEnexFileNameFromOutputPath') as boolean,
        keepMDCharactersOfENNotes: store.get('keepMDCharactersOfENNotes') as boolean,
        monospaceIsCodeBlock: store.get('monospaceIsCodeBlock') as boolean,
        keepOriginalHtml: store.get('keepOriginalHtml') as boolean,
        currentTemplate: store.get('currentTemplate') as string,
        resourcesDir: store.get('resourcesDir') as string,
        nestedTags: {
            separatorInEN: store.get('nestedTags.separatorInEN') as string,
            replaceSeparatorWith: store.get('nestedTags.replaceSeparatorWith') as string,
            replaceSpaceWith: store.get('nestedTags.replaceSpaceWith') as string,
        },
        logseqSettings: {
            journalNotes: store.get('logseqSettings.journalNotes') as boolean,
        },
        dateFormat: store.get('dateFormat') as string,
        keepImageSize: store.get('keepImageSize') as OutputFormat,
        keepOriginalAmountOfNewlines: store.get('keepOriginalAmountOfNewlines') as boolean,
        addExtensionToInternalLinks: store.get('addExtensionToInternalLinks') as boolean,
        generateNakedUrls: store.get('generateNakedUrls') as boolean,
        urlEncodeFileNamesAndLinks: store.get('urlEncodeFileNamesAndLinks') as boolean,
        haveEnexLevelResources: store.get('haveEnexLevelResources') as boolean,
        sanitizeResourceNameSpaces: store.get('sanitizeResourceNameSpaces') as boolean,
        replacementChar: store.get('replacementChar') as string,
    };
};
