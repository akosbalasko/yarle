// tslint:disable-next-line:no-require-imports
const Store = require('electron-store');

const { OutputFormat }  = require('../output-format');
const schema = {
  keepOriginalHtml: {
    type: 'boolean',
    default: true,
  },
    enexSources: {},
    // templateFile: {type: 'string'},
    outputDir: {type: 'string'},
    // isMetadataNeeded: { type: 'boolean', default: false },
    isNotebookNameNeeded: { type: 'boolean', default: false },
    isZettelkastenNeeded: { type: 'boolean', default: false },
    useZettelIdAsFilename: { type: 'boolean', default: false},
    plainTextNotesOnly: { type: 'boolean', default: false },
    addLocation: { type: 'boolean', default: false },
    addCreationTime: { type: 'boolean', default: false },
    addUpdateTime: { type: 'boolean', default: false },
    addSourceUrl: { type: 'boolean', default: false },
    addWebClips: { type: 'boolean', default: false },
    addTags: { type: 'boolean', default: false },
    useHashTags: { type: 'boolean', default: false },
    outputFormat: {type: 'string', default: OutputFormat.ObsidianMD},
    obsidianTaskTag: { type: 'string' },
    taskOutputFormat: {type: 'string', default: OutputFormat.ObsidianMD},
    skipEnexFileNameFromOutputPath: { type: 'boolean', default: false },
    keepMDCharactersOfENNotes: { type: 'boolean', default: false },
    monospaceIsCodeBlock: { type: 'boolean', default: false },
    resourcesDir: {type: 'string', default: '_resources'},
    configFilePath: {type: 'string'}
};

let store = new Store({schema, watch: true});
module.exports = store
