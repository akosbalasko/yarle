import assert from 'assert';
import fs from 'fs';
import parser from 'fast-xml-parser';
import moment from 'moment';

import * as utils from './../src/utils';
import * as  options from './../src/xml-parser.options';
import { updateFileContentSafely } from '../src/utils/file-utils';

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
        utils.setFileDates('./test/data/test-justText.enex', notes['note']['created'], notes['note']['updated']);
        const fStat = fs.statSync('./test/data/test-justText.enex');
        const atime = moment(fStat.atime).format();
        const mtime = moment(fStat.mtime).format();
        const referTime = moment('20181006T084411Z');
        assert.equal(atime, referTime.format());
        assert.equal(mtime, referTime.format());

    });

    it('throws an error in case of a missing file', () => {
        let errorHappened = false;
        try {
            utils.setFileDates('./test/data/do_not_exists.enex', notes['note']['created'], notes['note']['updated']);
        } catch (e) {
            errorHappened = true;
        }
        assert.ok(errorHappened);

    });
    it('set to now if no updated field in note',  () => {
            notes['note']['updated'] = undefined;
            utils.setFileDates('./test/data/test-justText.enex', notes['note']['created'], notes['note']['updated']);
            const fStat = fs.statSync('./test/data/test-justText.enex');
            const atime = moment(fStat.atime);
            const mtime = moment(fStat.mtime);
            const referTimeLo = moment().subtract(3, 's');
            const referTimeHi = moment().add(3, 's');
            assert.ok(atime.isBetween(referTimeLo, referTimeHi));
            assert.ok(mtime.isBetween(referTimeLo, referTimeHi));
    });

   });

describe('file utils', () => {
    it('update file content safely', () => {
        const filePath = './test/data/updateFileContentSafelyFile.md';
        const origFStat = fs.statSync(filePath);

        updateFileContentSafely(filePath, 'this is the updated File content');

        const newFStat = fs.statSync(filePath);

        assert.deepEqual(origFStat.birthtime, newFStat.birthtime);
        assert.deepEqual(origFStat.mtime, newFStat.mtime);

    });
    
})

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
    it('Mime, filename has extension, extension has greater precendence - JPG', () => {
        const resource = {
            mime: 'image/png',
            'resource-attributes': {
                'file-name': 'fileName.jpg',
            },
        };
        const extension = utils.getExtension(resource);
        assert.equal(extension, 'jpg');
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
        assert.ok(accessMoment.isSame(moment(timestamp)));
    });
    it('no stored timstamp, return now', () => {
        const resource = {
            'resource-attributes': {
            },
        };
        const accessMoment = utils.getTimeStampMoment(resource);
        const referTimeLo = moment().subtract(3, 's');
        const referTimeHi = moment().add(3, 's');
        assert.ok(accessMoment.isBetween(referTimeLo, referTimeHi));
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
        const fileProps = utils.getResourceFileProperties('./test/data', resource);
        assert.equal(fileProps.fileName, 'fileName.jpg');
    });
    it('filename returned, file already exists, no extension', () => {
        const resource = {
            'resource-attributes': {
                'file-name': 'simpleFile',
            },
        };
        const fileProps = utils.getResourceFileProperties('./test/data', resource);
        assert.equal(fileProps.fileName, 'simpleFile.1.dat');
    });
});
