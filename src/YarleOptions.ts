import { OutputFormat } from './output-format';

export interface YarleOptions {
    enexFile?: string;
    outputDir?: string;
    isMetadataNeeded?: boolean;
    isZettelkastenNeeded?: boolean;
    plainTextNotesOnly?: boolean;
    skipLocation?: boolean;
    skipCreationTime?: boolean;
    skipUpdateTime?: boolean;
    skipTags?: boolean;
    outputFormat?: OutputFormat;
}
