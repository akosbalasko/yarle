import * as yarle from './yarle';

// yarle.options = {sourceFile: process.argv[2]};
const options: any = {};
if (process.argv.includes('--no-metadata'))
    options['no-metadata'] = true;

options['enexFile'] = process.argv[2];

yarle.dropTheRope(options);
process.exit();
