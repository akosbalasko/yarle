import * as assert from 'assert';
import * as fs from 'fs';
import * as mockTimezone from 'timezone-mock';

import { OutputFormat } from '../src/output-format';

import * as utils from './../src/utils';
import * as yarle from './../src/yarle';
import { YarleOptions } from './../src/YarleOptions';

describe('dropTheRope ', async () => {
  before(() => {
    mockTimezone.register('Europe/London');
  });

  after(() => {
    mockTimezone.unregister();
  });

  afterEach(async () => {
    utils.clearSimpleNotesDistDir();
    utils.clearComplexNotesDistDir();
  });

  it('Empty enex file - throw eoent', async () => {
    let errorHappened = false;
    const options: YarleOptions = {
      enexFile: './test/data/do_not_exists.enex',
    };
    try {
      await yarle.dropTheRope(options);
    } catch (e) {
      errorHappened = true;
    }
    assert.equal(true, errorHappened);
  });

  it.skip('Enex file with note huge cell', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/backgroundGenes.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/simpleNotes/test-justText/test -note with text only.md`,
      ),
      true,
    );
    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/simpleNotes/test-justText/test -note with text only.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-justText.md`, 'utf8'),
    );
  });
  it('Enex file with note WithHyperlinkRefs', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-bracketlinks.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/simpleNotes/test-bracketlinks/test - bracketlinks.md`,
      ),
      true,
    );
    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/simpleNotes/test-bracketlinks/test - bracketlinks.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-bracketlinks.md`, 'utf8'),
    );
  });

  it('Enex file with note containing text only', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-justText.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/simpleNotes/test-justText/test -note with text only.md`,
      ),
      true,
    );
    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/simpleNotes/test-justText/test -note with text only.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-justText.md`, 'utf8'),
    );
  });

  it('Note with tags', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-noteWithTags.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/simpleNotes/test-noteWithTags/test -note with text only.md`,
      ),
      true,
    );
    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/simpleNotes/test-noteWithTags/test -note with text only.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-noteWithTags.md`, 'utf8'),
    );
  });

  it('Note with zettelkastel id', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-noteWithZettelKasten.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      isZettelkastenNeeded: true,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/simpleNotes/test-noteWithZettelKasten/201810060943 test -note with text only.md`,
      ),
      true,
    );
    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/simpleNotes/test-noteWithZettelKasten/201810060943 test -note with text only.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-noteWithZettelKasten.md`, 'utf8'),
    );
  });

  it('Note with zettelkastel id - no title', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-noteWithZettelKasten-notitle.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      isZettelkastenNeeded: true,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/simpleNotes/test-noteWithZettelKasten-notitle/201810060943.md`,
      ),
      true,
    );
    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/simpleNotes/test-noteWithZettelKasten-notitle/201810060943.md`,
        'utf8',
      ),
      fs.readFileSync(
        `${__dirname}/data/test-noteWithZettelKasten-notitle.md`,
        'utf8',
      ),
    );
  });

  it('Note without metadata', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-noteWithoutMetadata.enex',
      outputDir: 'out',
      isMetadataNeeded: false,
      isZettelkastenNeeded: false,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/simpleNotes/test-noteWithoutMetadata/test -note without metadata.md`,
      ),
      true,
    );
    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/simpleNotes/test-noteWithoutMetadata/test -note without metadata.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-noteWithoutMetadata.md`, 'utf8'),
    );
  });

  it('Note with latlong', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-noteWithLatLong.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/simpleNotes/test-noteWithLatLong/test.md`,
      ),
      true,
    );
    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/simpleNotes/test-noteWithLatLong/test.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-noteWithLatLong.md`, 'utf8'),
    );
  });

  it('Enex file with note containing a picture', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-withPicture.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/complexNotes/test-withPicture/test - note with picture.md`,
      ),
      true,
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/complexNotes/test-withPicture/_resources/test_-_note_with_picture.resources`,
      ),
      true,
    );

    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/complexNotes/test-withPicture/test - note with picture.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-withPicture.md`, 'utf8'),
    );
  });

  it('Skips images without src attribute', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-imageWithoutSrc.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
    };

    await yarle.dropTheRope(options);

    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/complexNotes/test-imageWithoutSrc/test-imagewithoutsrc.md`,
      ),
      true,
    );
    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/complexNotes/test-imageWithoutSrc/test-imagewithoutsrc.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-imageWithoutSrc.md`, 'utf8'),
    );
  });

  it('Enex file with note containing text and picture', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-textWithImage.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/complexNotes/test-textWithImage/untitled.md`,
      ),
      true,
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/complexNotes/test-textWithImage/_resources/untitled.resources`,
      ),
      true,
    );

    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/complexNotes//test-textWithImage/untitled.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-textWithImage.md`, 'utf8'),
    );
  });

  it('Enex file with multiple notes', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-twoNotes.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/complexNotes/test-twoNotes/test - note with picture.md`,
      ),
      true,
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/complexNotes/test-twoNotes/_resources/test_-_note_with_picture.resources`,
      ),
      true,
    );

    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/complexNotes/test-twoNotes/test - note with picture.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-twoNotes-pic.md`, 'utf8'),
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/simpleNotes/test-twoNotes/test -note with text only.md`,
      ),
      true,
    );

    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/simpleNotes/test-twoNotes/test -note with text only.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-twoNotes-text.md`, 'utf8'),
    );
  });

  it('Enex file with note containing more pictures', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-threePictures.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/complexNotes/test-threePictures/test - note with more pictures.md`,
      ),
      true,
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/complexNotes/test-threePictures/_resources/test_-_note_with_more_pictures.resources`,
      ),
      true,
    );

    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/complexNotes/test-threePictures/test - note with more pictures.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-threePictures.md`, 'utf8'),
    );
  });

  it('Enex file plaintextonly - skipping note that has resource in it', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-threePictures.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: true,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/complexNotestest-threePictures//test - note with more pictures.md`,
      ),
      false,
    );
  });
  it('Enex file skip Location', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-skipLocation.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      skipLocation: true,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/simpleNotes/test-skipLocation/skiplocation.md`,
      ),
      true,
    );
    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/simpleNotes/test-skipLocation/skiplocation.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-skipLocation.md`, 'utf8'),
    );
  });
  it('Enex file with two notes with same names', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-twoNotesWithSameName.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
      skipLocation: false,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/simpleNotes/test-twoNotesWithSameName/untitled.md`,
      ),
      true,
    );

    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/simpleNotes/test-twoNotesWithSameName/untitled.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-twoNotesWithSameName.md`, 'utf8'),
    );

    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/simpleNotes/test-twoNotesWithSameName/untitled.1.md`,
      ),
      true,
    );
    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/simpleNotes/test-twoNotesWithSameName/untitled.1.md`,
        'utf8',
      ),
      fs.readFileSync(
        `${__dirname}/data/test-twoNotesWithSameName.1.md`,
        'utf8',
      ),
    );
  });

  it('Enex file with table', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-table.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(`${__dirname}/../out/simpleNotes/test-table/table.md`),
      true,
    );

    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/simpleNotes/test-table/table.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-table.md`, 'utf8'),
    );
  });

  it('Enex file with specialItems', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-specialItems.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/simpleNotes/test-specialItems/special items.md`,
      ),
      true,
    );

    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/simpleNotes/test-specialItems/special items.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-specialItems.md`, 'utf8'),
    );
  });

  it('Enex file with links ', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-externalLink.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/simpleNotes/test-externalLink/external link.md`,
      ),
      true,
    );

    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/simpleNotes/test-externalLink/external link.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-externalLink.md`, 'utf8'),
    );
  });

  it('Enex file with links with resources', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-externalLinkWithPicture.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/complexNotes/test-externalLinkWithPicture/link with picture.md`,
      ),
      true,
    );

    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/complexNotes/test-externalLinkWithPicture/link with picture.md`,
        'utf8',
      ),
      fs.readFileSync(
        `${__dirname}/data/test-externalLinkWithPicture.md`,
        'utf8',
      ),
    );
  });

  it('Enex file with internal links ', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-links.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(`${__dirname}/../out/simpleNotes/test-links/notea.md`),
      true,
    );

    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/simpleNotes/test-links/notea.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-linksNoteA.md`, 'utf8'),
    );

    assert.equal(
      fs.existsSync(`${__dirname}/../out/simpleNotes/test-links/noteb.md`),
      true,
    );

    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/simpleNotes/test-links/noteb.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-linksNoteB.md`, 'utf8'),
    );
  });

  it('Enex file with highlighted text', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-highlights.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/simpleNotes/test-highlights/highlights.md`,
      ),
      true,
    );

    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/simpleNotes/test-highlights/highlights.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-highlights.md`, 'utf8'),
    );
  });
  it('Enex file with highlighted text - Obsidian-style', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-highlights.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
      outputFormat: OutputFormat.ObsidianMD,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/simpleNotes/test-highlights/highlights.md`,
      ),
      true,
    );

    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/simpleNotes/test-highlights/highlights.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-highlightsObsidian.md`, 'utf8'),
    );
  });
  it('Enex file with PDF attachment', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-pdfAttachment.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/complexNotes/test-pdfAttachment/pdfattachment.md`,
      ),
      true,
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/complexNotes/test-pdfAttachment/_resources/pdfattachment.resources/sample.pdf`,
      ),
      true,
    );
  });

  it('Enex file obsidian style', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-twoNotes.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      outputFormat: OutputFormat.ObsidianMD,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/complexNotes/test-twoNotes/test - note with picture.md`,
      ),
      true,
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/complexNotes/test-twoNotes/_resources/test_-_note_with_picture.resources`,
      ),
      true,
    );

    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/complexNotes/test-twoNotes/test - note with picture.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-obsidianLink.md`, 'utf8'),
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/simpleNotes/test-twoNotes/test -note with text only.md`,
      ),
      true,
    );

    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/simpleNotes/test-twoNotes/test -note with text only.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-twoNotes-text.md`, 'utf8'),
    );
  });

  it('Enex file - no span style', async () => {
    const options: YarleOptions = {
      enexFile: './test/data/test-nospanstyle.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
      outputFormat: OutputFormat.ObsidianMD,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/simpleNotes/test-nospanstyle/test-nospanstyle.md`,
      ),
      true,
    );

    assert.equal(
      fs.readFileSync(
        `${__dirname}/../out/simpleNotes/test-nospanstyle/test-nospanstyle.md`,
        'utf8',
      ),
      fs.readFileSync(`${__dirname}/data/test-nospanstyle.md`, 'utf8'),
    );
  });

});
