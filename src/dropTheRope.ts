import * as minimist from 'minimist';

import * as yarle from './yarle';
import { Options } from './options';

// const options: any = {};

const argv = minimist(process.argv.slice(2));
// console.dir(argv);

/*if (argv['include-metadata'] === 'true')
    options['-metadata'] = 'false';
*/
// options['enexFile'] = process.argv[2];
const options: Options = {
    enexFile: argv['enexFile'],
    outputDir: argv['outputDir'],
    isZettelkastenNeeded: argv['zettelkasten'] || false,
    isMetadataNeeded: argv['include-metadata'] || false ,
};
/*
possible options in argvs
-include-metadata - includes metadata into md files
-zettelkasten - generates zettelkasten id based on Creation date in the file date
-input -Enex file
-outputDir - outputDir (two subdirs are going to be created (simpleNotes, complexNotes))
*/

yarle.dropTheRope(options);
process.exit();
