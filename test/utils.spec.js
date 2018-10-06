var assert = require('assert');
const utils = require('./../src/utils');
const fs = require('fs');
var parser = require('fast-xml-parser');
const options = require('./../src/xml-parser.options');
var moment = require('moment');

/*
    setFileDates,
    logBeginning,
    logTags,
    logLatLong,
    logUpdateTime,
    logCreationTime,
    logTitle,
    getMetadata,
    getFilePath,
    getNoteName,
*/
describe('SetFileDates', function () {
    let content, notebook, notes;
    before(()=> {
        content = fs.readFileSync('./test/data/test-justText.enex', 'utf8');
        notebook = parser.parse(content,options);
        notes = notebook['en-export'];

    });

    it('happy path =» file exists and modified successfully', function() {
        utils.setFileDates('./test/data/test-justText.enex',notes['note'])
        const fStat = fs.statSync('./test/data/test-justText.enex');
        const atime = moment(fStat.atime).format();
        const mtime = moment(fStat.mtime).format();
        const referTime = moment('20181006T084411Z');
        assert.equal(atime, referTime.format());
        assert.equal(mtime, referTime.format())

    });
    it('throw enoent in case of missing file', function(){
        let errorHappened = false;
        try{
            utils.setFileDates('./test/data/do_not_exists.enex',notes['note'])
        } catch(e){
            errorHappened = true;
        }
        assert.equal(true,errorHappened);

    });
    it('set to now if no updated field in note', function(){
            notes['note']['updated'] = undefined;
            utils.setFileDates('./test/data/test-justText.enex',notes['note'])
            const fStat = fs.statSync('./test/data/test-justText.enex');
            const atime = moment(fStat.atime).format();
            const mtime = moment(fStat.mtime).format();
            const referTime = moment();
            assert.equal(atime, referTime.format());
            assert.equal(mtime, referTime.format())

    });

    
   });
