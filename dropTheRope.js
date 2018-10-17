

const yarle = require('./src/yarle');
yarle.options = {sourceFile: process.argv[2]};
/*if (process.argv.includes('--no-metadata')){
    yarle.options = { ...yarle.options, "no-metadata":true}

}*/
yarle.dropTheRope(process.argv[2]);
process.exit();