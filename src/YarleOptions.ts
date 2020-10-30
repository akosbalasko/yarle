import { OutputFormat } from './output-format';

export interface YarleOptions {
    enexFile?: string;
    outputDir?: string;
    isMetadataNeeded?: boolean;
    isNotebookNameNeeded?: boolean;
    isZettelkastenNeeded?: boolean;
    plainTextNotesOnly?: boolean;
    skipLocation?: boolean;
    skipCreationTime?: boolean;
    skipUpdateTime?: boolean;
    skipWebClips?: boolean;
    skipTags?: boolean;
    outputFormat?: OutputFormat;
}
