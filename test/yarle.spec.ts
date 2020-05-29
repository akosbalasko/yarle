import * as assert from 'assert';
import * as fs from 'fs';

import * as utils from './../src/utils';
import * as yarle from './../src/yarle';
import { YarleOptions } from './../src/YarleOptions';

describe('dropTheRope ', () => {

    afterEach(() => {
         utils.clearSimpleNotesDistDir();
         utils.clearComplexNotesDistDir();

    });

    it('Empty enex file - throw eoent', () => {
        let errorHappened = false;
        const options: YarleOptions = {
            enexFile: './test/data/do_not_exists.enex',
        };
        try {
            yarle.dropTheRope(options);
        } catch (e) {
            errorHappened = true;
        }
        assert.equal(true, errorHappened);
    });

    it('Enex file with note containing text only', () => {
        const options: YarleOptions = {
            enexFile: './test/data/test-justText.enex',
            outputDir: 'out',
            isMetadataNeeded: true,
        };
        yarle.dropTheRope(options);
        assert.equal(fs.existsSync(`${__dirname}/../out/simpleNotes/test-justText/test -note with text only.md`), true);
        assert.equal(fs.readFileSync(`${__dirname}/../out/simpleNotes/test-justText/test -note with text only.md`, 'utf8'),
                     fs.readFileSync(`${__dirname}/data/test-justText.md`, 'utf8'));

    });

    it('Note with tags', () => {
        const options: YarleOptions = {
            enexFile: './test/data/test-noteWithTags.enex',
            outputDir: 'out',
            isMetadataNeeded: true,
        };
        yarle.dropTheRope(options);
        assert.equal(fs.existsSync(`${__dirname}/../out/simpleNotes/test-noteWithTags/test -note with text only.md`), true);
        assert.equal(fs.readFileSync(`${__dirname}/../out/simpleNotes/test-noteWithTags/test -note with text only.md`, 'utf8'),
                     fs.readFileSync(`${__dirname}/data/test-noteWithTags.md`, 'utf8'));

    });

    it('Note with zettelkastel id', () => {
        const options: YarleOptions = {
            enexFile: './test/data/test-noteWithZettelKasten.enex',
            outputDir: 'out',
            isMetadataNeeded: true,
            isZettelkastenNeeded: true,
        };
        yarle.dropTheRope(options);
        assert.equal(fs.existsSync(`${__dirname}/../out/simpleNotes/test-noteWithZettelKasten/201810061043 test -note with text only.md`), true);
        assert.equal(fs.readFileSync(`${__dirname}/../out/simpleNotes/test-noteWithZettelKasten/201810061043 test -note with text only.md`, 'utf8'),
                     fs.readFileSync(`${__dirname}/data/test-noteWithZettelKasten.md`, 'utf8'));

    });

    it.skip('Note with zettelkastel id - no title', () => {
        const options: YarleOptions = {
            enexFile: './test/data/test-noteWithZettelKasten-notitle.enex',
            outputDir: 'out',
            isMetadataNeeded: true,
            isZettelkastenNeeded: true,
        };
        yarle.dropTheRope(options);
        assert.equal(fs.existsSync(`${__dirname}/../out/simpleNotes/test-noteWithZettelKasten-notitle/201810061043.md`), true);
        assert.equal(fs.readFileSync(`${__dirname}/../out/simpleNotes/test-noteWithZettelKasten-notitle/201810061043.md`, 'utf8'),
                     fs.readFileSync(`${__dirname}/data/test-noteWithZettelKasten-notitle.md`, 'utf8'));

    });

    it('Note without metadata', () => {
        const options: YarleOptions = {
            enexFile: './test/data/test-noteWithoutMetadata.enex',
            outputDir: 'out',
            isMetadataNeeded: false,
            isZettelkastenNeeded: false,
        };
        yarle.dropTheRope(options);
        assert.equal(fs.existsSync(`${__dirname}/../out/simpleNotes/test-noteWithoutMetadata/test -note without metadata.md`), true);
        assert.equal(fs.readFileSync(`${__dirname}/../out/simpleNotes/test-noteWithoutMetadata/test -note without metadata.md`, 'utf8'),
                     fs.readFileSync(`${__dirname}/data/test-noteWithoutMetadata.md`, 'utf8'));

    });

    it('Note with latlong', () => {
        const options: YarleOptions = {
            enexFile: './test/data/test-noteWithLatLong.enex',
            outputDir: 'out',
            isMetadataNeeded: true,
        };
        yarle.dropTheRope(options);
        assert.equal(fs.existsSync(`${__dirname}/../out/simpleNotes/test-noteWithLatLong/test.md`), true);
        assert.equal(fs.readFileSync(`${__dirname}/../out/simpleNotes/test-noteWithLatLong/test.md`, 'utf8'),
                     fs.readFileSync(`${__dirname}/data/test-noteWithLatLong.md`, 'utf8'));

    });

    it('Enex file with note containing a picture', () => {
        const options: YarleOptions = {
            enexFile: './test/data/test-withPicture.enex',
            outputDir: 'out',
            isMetadataNeeded: true,

        };
        yarle.dropTheRope(options);
        assert.equal(fs.existsSync(`${__dirname}/../out/complexNotes/test-withPicture/test - note with picture.md`), true);
        assert.equal(fs.existsSync(`${__dirname}/../out/complexNotes/test-withPicture/_resources/test_-_note_with_picture.resources`), true);

        assert.equal(fs.readFileSync(`${__dirname}/../out/complexNotes/test-withPicture/test - note with picture.md`, 'utf8'),
        fs.readFileSync(`${__dirname}/data/test-withPicture.md`, 'utf8'));

    });

    it('Enex file with multiple notes', () => {
        const options: YarleOptions = {
            enexFile: './test/data/test-twoNotes.enex',
            outputDir: 'out',
            isMetadataNeeded: true,

        };
        yarle.dropTheRope(options);
        assert.equal(fs.existsSync(`${__dirname}/../out/complexNotes/test-twoNotes/test - note with picture.md`), true);
        assert.equal(fs.existsSync(`${__dirname}/../out/complexNotes/test-twoNotes/_resources/test_-_note_with_picture.resources`), true);

        assert.equal(fs.readFileSync(`${__dirname}/../out/complexNotes/test-twoNotes/test - note with picture.md`, 'utf8'),
                     fs.readFileSync(`${__dirname}/data/test-twoNotes-pic.md`, 'utf8'));
        assert.equal(fs.existsSync(`${__dirname}/../out/simpleNotes/test-twoNotes/test -note with text only.md`), true);

        assert.equal(fs.readFileSync(`${__dirname}/../out/simpleNotes/test-twoNotes/test -note with text only.md`, 'utf8'),
                    fs.readFileSync(`${__dirname}/data/test-twoNotes-text.md`, 'utf8'));

    });

    it('Enex file with note containing more pictures', () => {
        const options: YarleOptions = {
            enexFile: './test/data/test-threePictures.enex',
            outputDir: 'out',
            isMetadataNeeded: true,

        };
        yarle.dropTheRope(options);
        assert.equal(fs.existsSync(`${__dirname}/../out/complexNotes/test-threePictures/test - note with more pictures.md`), true);
        assert.equal(fs.existsSync(`${__dirname}/../out/complexNotes/test-threePictures/_resources/test_-_note_with_more_pictures.resources`), true);

        assert.equal(fs.readFileSync(`${__dirname}/../out/complexNotes/test-threePictures/test - note with more pictures.md`, 'utf8'),
        fs.readFileSync(`${__dirname}/data/test-threePictures.md`, 'utf8'));

    });

    it('Enex file plaintextonly - skipping note that has resource in it', () => {
        const options: YarleOptions = {
            enexFile: './test/data/test-threePictures.enex',
            outputDir: 'out',
            isMetadataNeeded: true,
            plainTextNotesOnly: true,

        };
        yarle.dropTheRope(options);
        assert.equal(fs.existsSync(`${__dirname}/../out/complexNotestest-threePictures//test - note with more pictures.md`), false);

    });
    it('Enex file skip Location', () => {
        const options: YarleOptions = {
            enexFile: './test/data/test-skipLocation.enex',
            outputDir: 'out',
            isMetadataNeeded: true,
            skipLocation: true,

        };
        yarle.dropTheRope(options);
        assert.equal(fs.existsSync(`${__dirname}/../out/simpleNotes/test-skipLocation/SkipLocation.md`), true);
        assert.equal(fs.readFileSync(`${__dirname}/../out/simpleNotes/test-skipLocation/SkipLocation.md`, 'utf8'),
        fs.readFileSync(`${__dirname}/data/test-SkipLocation.md`, 'utf8'));
    });
    it('Enex file with two notes with same names', () => {
        const options: YarleOptions = {
            enexFile: './test/data/test-twoNotesWithSameName.enex',
            outputDir: 'out',
            isMetadataNeeded: true,
            plainTextNotesOnly: false,
            skipLocation: false,

        };
        yarle.dropTheRope(options);
        assert.equal(fs.existsSync(`${__dirname}/../out/simpleNotes/test-twoNotesWithSameName/untitled.md`), true);

        assert.equal(fs.readFileSync(`${__dirname}/../out/simpleNotes/test-twoNotesWithSameName/untitled.md`, 'utf8'),
                     fs.readFileSync(`${__dirname}/data/test-twoNotesWithSameName.md`, 'utf8'));

        assert.equal(fs.existsSync(`${__dirname}/../out/simpleNotes/test-twoNotesWithSameName/untitled.1.md`), true);
        assert.equal(fs.readFileSync(`${__dirname}/../out/simpleNotes/test-twoNotesWithSameName/untitled.1.md`, 'utf8'),
                    fs.readFileSync(`${__dirname}/data/test-twoNotesWithSameName.1.md`, 'utf8'));
    });

    it('Enex file with table', () => {
        const options: YarleOptions = {
            enexFile: './test/data/test-table.enex',
            outputDir: 'out',
            isMetadataNeeded: true,
            plainTextNotesOnly: false,

        };
        yarle.dropTheRope(options);
        assert.equal(fs.existsSync(`${__dirname}/../out/simpleNotes/test-table/table.md`), true);

        assert.equal(fs.readFileSync(`${__dirname}/../out/simpleNotes/test-table/table.md`, 'utf8'),
                     fs.readFileSync(`${__dirname}/data/test-table.md`, 'utf8'));

    });

    it('Enex file with specialItems', () => {
        const options: YarleOptions = {
            enexFile: './test/data/test-specialItems.enex',
            outputDir: 'out',
            isMetadataNeeded: true,
            plainTextNotesOnly: false,

        };
        yarle.dropTheRope(options);
        assert.equal(fs.existsSync(`${__dirname}/../out/simpleNotes/test-specialItems/special items.md`), true);

        assert.equal(fs.readFileSync(`${__dirname}/../out/simpleNotes/test-specialItems/special items.md`, 'utf8'),
                     fs.readFileSync(`${__dirname}/data/test-specialItems.md`, 'utf8'));

    });

    it('Enex file with links ', () => {
        const options: YarleOptions = {
            enexFile: './test/data/test-externalLink.enex',
            outputDir: 'out',
            isMetadataNeeded: true,
            plainTextNotesOnly: false,

        };
        yarle.dropTheRope(options);
        assert.equal(fs.existsSync(`${__dirname}/../out/simpleNotes/test-externalLink/External Link.md`), true);

        assert.equal(fs.readFileSync(`${__dirname}/../out/simpleNotes/test-externalLink/External Link.md`, 'utf8'),
                     fs.readFileSync(`${__dirname}/data/test-externalLink.md`, 'utf8'));

    });

    it('Enex file with links with resources', () => {
        const options: YarleOptions = {
            enexFile: './test/data/test-externalLinkWithPicture.enex',
            outputDir: 'out',
            isMetadataNeeded: true,
            plainTextNotesOnly: false,

        };
        yarle.dropTheRope(options);
        assert.equal(fs.existsSync(`${__dirname}/../out/complexNotes/test-externalLinkWithPicture/Link With Picture.md`), true);

        assert.equal(fs.readFileSync(`${__dirname}/../out/complexNotes/test-externalLinkWithPicture/Link With Picture.md`, 'utf8'),
                     fs.readFileSync(`${__dirname}/data/test-externalLinkWithPicture.md`, 'utf8'));

    });

    it('Enex file with internal links ', () => {
        const options: YarleOptions = {
            enexFile: './test/data/test-links.enex',
            outputDir: 'out',
            isMetadataNeeded: true,
            plainTextNotesOnly: false,

        };
        yarle.dropTheRope(options);
        assert.equal(fs.existsSync(`${__dirname}/../out/simpleNotes/test-links/notea.md`), true);

        assert.equal(fs.readFileSync(`${__dirname}/../out/simpleNotes/test-links/notea.md`, 'utf8'),
                     fs.readFileSync(`${__dirname}/data/test-linksNoteA.md`, 'utf8'));

        assert.equal(fs.existsSync(`${__dirname}/../out/simpleNotes/test-links/noteb.md`), true);

        assert.equal(fs.readFileSync(`${__dirname}/../out/simpleNotes/test-links/noteb.md`, 'utf8'),
                    fs.readFileSync(`${__dirname}/data/test-linksNoteB.md`, 'utf8'));

    });
});
