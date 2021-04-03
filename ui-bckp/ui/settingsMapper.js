"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("./store");
exports.mapSettingsToYarleOptions = () => {
    return {
        enexSource: store_1.store.get('enexSource'),
        outputDir: store_1.store.get('outputDir'),
        isMetadataNeeded: true,
        isNotebookNameNeeded: store_1.store.get('isNotebookNameNeeded'),
        isZettelkastenNeeded: store_1.store.get('isZettelkastenNeeded'),
        plainTextNotesOnly: store_1.store.get('plainTextNotesOnly'),
        skipLocation: !store_1.store.get('addLocation'),
        skipCreationTime: !store_1.store.get('addCreationTime'),
        skipUpdateTime: !store_1.store.get('addUpdateTime'),
        skipSourceUrl: !store_1.store.get('addSourceUrl'),
        skipWebClips: !store_1.store.get('addWebClips'),
        skipTags: !store_1.store.get('addTags'),
        useHashTags: store_1.store.get('useHashTags'),
        outputFormat: store_1.store.get('outputFormat'),
        skipEnexFileNameFromOutputPath: store_1.store.get('skipEnexFileNameFromOutputPath'),
        keepMDCharactersOfENNotes: store_1.store.get('keepMDCharactersOfENNotes'),
        monospaceIsCodeBlock: store_1.store.get('monospaceIsCodeBlock'),
        keepOriginalHtml: store_1.store.get('keepOriginalHtml'),
    };
};
//# sourceMappingURL=settingsMapper.js.map