/* istanbul ignore file */
import * as minimist from 'minimist';

import * as yarle from './yarle';
import { YarleOptions } from './YarleOptions';

export const run = () => {
    const argv = minimist(process.argv.slice(2));

    const options: YarleOptions = {
        enexFile: argv['enexFile'],
        outputDir: argv['outputDir'],
        isZettelkastenNeeded: argv['zettelkasten'] || false,
        isMetadataNeeded: argv['include-metadata'] || false ,
        plainTextNotesOnly: argv['plaintext-notes-only'] || false ,
        wikiStyleMediaLinks: argv['wikistyle-media-links'] || false ,
        skipLocation: argv['skip-latlng'] || false ,
        skipCreationTime: argv['skip-creation-time'] || false ,
        skipUpdateTime: argv['skip-update-time'] || false ,
        skipTags: argv['skip-tags'] || false ,
    };

    yarle.dropTheRope(options);
    process.exit();
};
run();
