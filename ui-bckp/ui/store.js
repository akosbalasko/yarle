"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Store = require("electron-store");
const output_format_1 = require("./../output-format");
const schema = {
    keepOriginalHtml: {
        type: 'boolean',
        default: true
    },
    enexSource: { type: 'string' },
    templateFile: { type: 'string' },
    outputDir: { type: 'string' },
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
    outputFormat: { type: 'string', default: output_format_1.OutputFormat.ObsidianMD },
    skipEnexFileNameFromOutputPath: { type: 'boolean', default: false },
    keepMDCharactersOfENNotes: { type: 'boolean', default: false },
    monospaceIsCodeBlock: { type: 'boolean', default: false },
};
exports.store = new Store({ schema });
//# sourceMappingURL=store.js.map