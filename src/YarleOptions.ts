import { OutputFormat } from './output-format';

export interface YarleOptions {
    enexSource?: string;
    templateFile?: string;
    outputDir?: string;
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
    monospaceIsCodeBlock?: boolean;
}
