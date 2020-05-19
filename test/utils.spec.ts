import * as  assert from 'assert';
import * as fs from 'fs';
import * as parser from 'fast-xml-parser';
import * as moment from 'moment';

import * as utils from './../src/utils';
import * as  options from './../src/xml-parser.options';

describe('SetFileDates', () => {
    let content;
    let notebook;
    let notes: any;

    before(() => {
        content = fs.readFileSync('./test/data/test-justText.enex', 'utf8');
        notebook = parser.parse(content, options.xmlParserOptions);
        notes = notebook['en-export'];

    });

    it('happy path =» file exists and modified successfully', () => {
        utils.setFileDates('./test/data/test-justText.enex',notes['note']);
        const fStat = fs.statSync('./test/data/test-justText.enex');
        const atime = moment(fStat.atime).format();
        const mtime = moment(fStat.mtime).format();
        const referTime = moment('20181006T084411Z');
        assert.equal(atime, referTime.format());
        assert.equal(mtime, referTime.format());

    });

    it('throw enoent in case of missing file', () => {
        let errorHappened = false;
        try {
            utils.setFileDates('./test/data/do_not_exists.enex', notes['note']);
        } catch (e) {
            errorHappened = true;
        }
        assert.equal(true, errorHappened);

    });
    it('set to now if no updated field in note',  () => {
            notes['note']['updated'] = undefined;
            utils.setFileDates('./test/data/test-justText.enex', notes['note']);
            const fStat = fs.statSync('./test/data/test-justText.enex');
            const atime = moment(fStat.atime).format();
            const mtime = moment(fStat.mtime).format();
            const referTime = moment();
            assert.equal(atime, referTime.format());
            assert.equal(mtime, referTime.format());

    });

   });
