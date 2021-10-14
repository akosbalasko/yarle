// tslint:disable-next-line:no-require-imports
import Store = require('electron-store');
import { OutputFormat } from './../output-format';
const schema: any = {
  keepOriginalHtml: {
    type: 'boolean',
    default: true,
  },
    enexSources: {type: 'array'},
    // templateFile: {type: 'string'},
    outputDir: {type: 'string'},
    // isMetadataNeeded: { type: 'boolean', default: false },
    isNotebookNameNeeded: { type: 'boolean', default: false },
    isZettelkastenNeeded: { type: 'boolean', default: false },
    plainTextNotesOnly: { type: 'boolean', default: false },
    addLocation: { type: 'boolean', default: false },
    addCreationTime: { type: 'boolean', default: false },
    addUpdateTime: { type: 'boolean', default: false },
    addSourceUrl: { type: 'boolean', default: false },
    addWebClips: { type: 'boolean', default: false },
    addTags: { type: 'boolean', default: false },
    useHashTags: { type: 'boolean', default: false },
    outputFormat: {type: 'string', default: OutputFormat.ObsidianMD},
    skipEnexFileNameFromOutputPath: { type: 'boolean', default: false },
    keepMDCharactersOfENNotes: { type: 'boolean', default: false },
    monospaceIsCodeBlock: { type: 'boolean', default: false },
    resourcesDir: {type: 'string', default: '_resources'},
};

export const store = new Store({schema, watch: true});
