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
        utils.setFileDates('./test/data/test-justText.enex', notes['note']);
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

describe('extensions', () => {
    it('no resource-attributes', () => {
        const resource = {};
        const extension = utils.getExtension(resource);
        assert.equal(extension, 'dat');
    });
    it('no mime, no filename', () => {
        const resource = {
            'resource-attributes': {
            },
        };
        const extension = utils.getExtension(resource);
        assert.equal(extension, 'dat');
    });
    it('no mime, no filename extension - DAT', () => {
        const resource = {
            'resource-attributes': {
                'file-name': 'fileName',
            },
        };
        const extension = utils.getExtension(resource);
        assert.equal(extension, 'dat');
    });
    it('no mime, filename has extension - JPG', () => {
        const resource = {
            'resource-attributes': {
                'file-name': 'fileName.jpg',
            },
        };
        const extension = utils.getExtension(resource);
        assert.equal(extension, 'jpg');
    });
    it('Mime, filename has no extension - PNG', () => {
        const resource = {
            mime: 'image/png',
            'resource-attributes': {
                'file-name': 'fileName',
            },
        };
        const extension = utils.getExtension(resource);
        assert.equal(extension, 'png');
    });
    it('Mime, filename has extension, mime has greater precendence - PNG', () => {
        const resource = {
            mime: 'image/png',
            'resource-attributes': {
                'file-name': 'fileName.jpg',
            },
        };
        const extension = utils.getExtension(resource);
        assert.equal(extension, 'png');
    });
    it('Mime, filename has extension, mime cannot be parsed - PNG', () => {
        const resource = {
            mime: 'image-png',
            'resource-attributes': {
                'file-name': 'fileName.jpg',
            },
        };
        const extension = utils.getExtension(resource);
        assert.equal(extension, 'jpg');
    });
});

describe('timestamps', () => {
    it('timestamp returned', () => {
        const timestamp = '19700101T000000Z';
        const resource = {
                'resource-attributes': {
                    timestamp,
                },
        };
        const accessMoment = utils.getTimeStampMoment(resource);
        assert.equal(accessMoment.isSame(moment(timestamp)), true);
    });
    it('no stored timstamp, return now', () => {
        const resource = {
            'resource-attributes': {
            },
        };
        const accessMoment = utils.getTimeStampMoment(resource);
        assert.equal(accessMoment.isSame(moment()), true);
    });
});

describe('filename', () => {
    it('filename returned', () => {
        const resource = {
            mime: 'image/png',
            'resource-attributes': {
                'file-name': 'fileName.jpg',
            },
        };
        const fileName = utils.getResourceFileName('./test/data', resource);
        assert.equal(fileName, 'fileName.png');
    });
    it('filename returned, file already exists, no extension', () => {
        const resource = {
            'resource-attributes': {
                'file-name': 'simpleFile',
            },
        };
        const fileName = utils.getResourceFileName('./test/data', resource);
        assert.equal(fileName, 'simpleFile.1.dat');
    });
});