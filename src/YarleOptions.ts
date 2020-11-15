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
    skipWebClips?: boolean;
    skipTags?: boolean;
    outputFormat?: OutputFormat;
    skipEnexFileNameFromOutputPath?: boolean;
}
