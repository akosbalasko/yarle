import { OutputFormat } from './output-format';
import { TagSeparatorReplaceOptions } from './models';

export interface YarleOptions {
    enexSource?: string;
    templateFile?: string;
    currentTemplate?: string;
    outputDir?: string;
    keepOriginalHtml?: boolean;
    isMetadataNeeded?: boolean;
    isNotebookNameNeeded?: boolean;
    isZettelkastenNeeded?: boolean;
    plainTextNotesOnly?: boolean;
    skipLocation?: boolean;
    skipCreationTime?: boolean;
    skipUpdateTime?: boolean;
    skipSourceUrl?: boolean;
    skipWebClips?: boolean;
    skipTags?: boolean;
    useHashTags?: boolean;
    outputFormat?: OutputFormat;
    skipEnexFileNameFromOutputPath?: boolean;
    keepMDCharactersOfENNotes?: boolean;
    monospaceIsCodeBlock?: boolean;
    dateFormat?: string;
    nestedTags?: TagSeparatorReplaceOptions;
}
