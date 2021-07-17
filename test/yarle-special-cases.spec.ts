import assert from 'assert';
import fs from 'fs';
import eol from 'eol'
import mockTimezone from 'timezone-mock';
import * as path from 'path';
import { OutputFormat } from './../src/output-format';
import * as utils from './../src/utils';
import * as yarle from './../src/yarle';
import * as dropTheRopeRunner from './../src/dropTheRopeRunner';
import { YarleOptions } from './../src/YarleOptions';
import { LOGFILE } from './../src/utils';

const testDataFolder = `.${path.sep}test${path.sep}data${path.sep}`;

describe('Yarle special cases', async () => {
  before(() => {
    mockTimezone.register('Europe/London');

  });

  after(() => {
    mockTimezone.unregister();

  });

  afterEach(async () => {
    utils.clearMdNotesDistDir();
  });

  it.skip('Empty enex file - throw eoent', async () => {
    let errorHappened = false;
    const options: YarleOptions = {
      enexSource: `${testDataFolder}do_not_exists.enex`,
    };
    try {
      await yarle.dropTheRope(options);
    } catch (e) {
      errorHappened = true;
    }
    assert.equal(true, errorHappened);
  });


  it('Enex file with note containing a picture', async () => {
    const options: YarleOptions = {
      enexSource: `.${path.sep}test${path.sep}data${path.sep}test-withPicture.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
    };
    await yarle.dropTheRope(options);
    console.log(`conversion log: ${fs.readFileSync(LOGFILE)}`);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-withPicture/test - note with picture.md`,
      ),
      true,
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-withPicture/_resources/test_-_note_with_picture.resources`,
      ),
      true,
    );

    assert.equal(
      eol.auto(fs.readFileSync(
        `${__dirname}/../out/notes/test-withPicture/test - note with picture.md`,
        'utf8',
      )),
      fs.readFileSync(`${__dirname}/data/test-withPicture.md`, 'utf8'),
    );
  });

  it('Override resourcesDir', async () => {
    const options: YarleOptions = {
      enexSource: `.${path.sep}test${path.sep}data${path.sep}test-withPicture.enex`,
      outputDir: 'out',
      resourcesDir: '_attachments',
      isMetadataNeeded: true,
    };
    await yarle.dropTheRope(options);
    console.log(`conversion log: ${fs.readFileSync(LOGFILE)}`);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-withPicture/test - note with picture.md`,
      ),
      true,
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-withPicture/_attachments/test_-_note_with_picture.resources`,
      ),
      true,
    );

    assert.equal(
      eol.auto(fs.readFileSync(
        `${__dirname}/../out/notes/test-withPicture/test - note with picture.md`,
        'utf8',
      )),
      fs.readFileSync(`${__dirname}/data/test-withPicture-customResourcesDir.md`, 'utf8'),
    );
  });

  it.skip('should keep Html content', async () => {

    const options: YarleOptions = {
      enexSource: `${testDataFolder}test-withPicture-keep-html.enex`,
      templateFile: `${testDataFolder}keephtml-template.tmpl`,
      outputDir: 'out',
    };

    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-withPicture-keep-html/test - note with picture.md`,
      ),
      true,
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-withPicture-keep-html/_resources/test - note with picture.html`,
      ),
      true,
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-withPicture-keep-html/_resources/test_-_note_with_picture.resources`,
      ),
      true,
    );

    assert.equal(
      eol.auto(fs.readFileSync(
        `${__dirname}/../out/notes/test-withPicture-keep-html/test - note with picture.md`,
        'utf8',
      )),
      fs.readFileSync(`${__dirname}/data/test-withPicture-keep-html.md`, 'utf8'),
    );

    assert.equal(
      eol.auto(fs.readFileSync(
        `${__dirname}/../out/notes/test-withPicture-keep-html/_resources/test - note with picture.html`,
        'utf8',
      )),
      fs.readFileSync(`${__dirname}/data/test-note-with-picture.html`, 'utf8'),
    );

  });

  it('Enex file with note containing text and picture', async () => {
    const options: YarleOptions = {
      enexSource: `${testDataFolder}test-textWithImage.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-textWithImage/Untitled.md`,
      ),
      true,
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-textWithImage/_resources/Untitled.resources`,
      ),
      true,
    );

    assert.equal(
      eol.auto(fs.readFileSync(
        `${__dirname}/../out/notes//test-textWithImage/Untitled.md`,
        'utf8',
      )),
      fs.readFileSync(`${__dirname}/data/test-textWithImage.md`, 'utf8'),
    );
  });
  it('Absolute paths', async () => {
    const options: YarleOptions = {
      enexSource: `${testDataFolder}test-textWithImage.enex`,
      outputDir: '/tmp/out',
      isMetadataNeeded: true,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `/tmp/out/notes/test-textWithImage/Untitled.md`,
      ),
      true,
    );
    assert.equal(
      fs.existsSync(
        `/tmp/out/notes/test-textWithImage/_resources/Untitled.resources`,
      ),
      true,
    );

    assert.equal(
      eol.auto(fs.readFileSync(
        `/tmp/out/notes//test-textWithImage/Untitled.md`,
        'utf8',
      )),
      fs.readFileSync(`${__dirname}/data/test-textWithImage.md`, 'utf8'),
    );
  });
  it('Enex file with multiple notes', async () => {
    const options: YarleOptions = {
      enexSource: `${testDataFolder}test-twoNotes.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-twoNotes/test - note with picture.md`,
      ),
      true,
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-twoNotes/_resources/test_-_note_with_picture.resources`,
      ),
      true,
    );

    assert.equal(
      eol.auto(fs.readFileSync(
        `${__dirname}/../out/notes/test-twoNotes/test - note with picture.md`,
        'utf8',
      )),
      fs.readFileSync(`${__dirname}/data/test-twoNotes-pic.md`, 'utf8'),
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-twoNotes/test -note with text only.md`,
      ),
      true,
    );

    assert.equal(
      eol.auto(fs.readFileSync(
        `${__dirname}/../out/notes/test-twoNotes/test -note with text only.md`,
        'utf8',
      )),
      fs.readFileSync(`${__dirname}/data/test-twoNotes-text.md`, 'utf8'),
    );
  });

  it('Enex file with note containing more pictures', async () => {
    const options: YarleOptions = {
      enexSource: `${testDataFolder}test-threePictures.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-threePictures/test - note with more pictures.md`,
      ),
      true,
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-threePictures/_resources/test_-_note_with_more_pictures.resources`,
      ),
      true,
    );

    assert.equal(
      eol.auto(fs.readFileSync(
        `${__dirname}/../out/notes/test-threePictures/test - note with more pictures.md`,
        'utf8',
      )),
      fs.readFileSync(`${__dirname}/data/test-threePictures.md`, 'utf8'),
    );
  });

  it('Enex file with images using data urls', async () => {
    const options: YarleOptions = {
      enexSource: `${testDataFolder}test-image-dataUrl.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-image-dataUrl/test - image - dataUrl.md`,
      ),
      true,
    );
    assert.equal(
      eol.auto(fs.readFileSync(
        `${__dirname}/../out/notes/test-image-dataUrl/test - image - dataUrl.md`,
        'utf8',
      )),
      fs.readFileSync(`${__dirname}/data/test-image-dataUrl.md`, 'utf8'),
    );

    // Make sure data-url and en-media resources all exist.
    // (Really, we ought to be checking specific resource contents --
    // e.g., with chai-fs `assert.directoryEqual(outResourcesDir, expectedResourcesDir)`.)
    ['embedded.png', 'embedded.1.svg', 'embedded.2.svg', 'embedded.3.svg', 'photo.png'].forEach(
      resource => assert(
        fs.existsSync(
          `${__dirname}/../out/notes/test-image-dataUrl/_resources/test_-_image_-_dataUrl.resources/${resource}`,
        ),
        `Resource file ${resource} not created`,
      ));
  });

  it('Enex file with two notes with same names', async () => {
    const options: YarleOptions = {
      enexSource: `${testDataFolder}test-twoNotesWithSameName.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
      skipLocation: false,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-twoNotesWithSameName/Untitled.md`,
      ),
      true,
    );

    assert.equal(
      eol.auto(fs.readFileSync(
        `${__dirname}/../out/notes/test-twoNotesWithSameName/Untitled.md`,
        'utf8',
      )),
      fs.readFileSync(`${__dirname}/data/test-twoNotesWithSameName.md`, 'utf8'),
    );

    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-twoNotesWithSameName/Untitled.1.md`,
      ),
      true,
    );
    assert.equal(
      eol.auto(fs.readFileSync(
        `${__dirname}/../out/notes/test-twoNotesWithSameName/Untitled.1.md`,
        'utf8',
      )),
      fs.readFileSync(
        `${__dirname}/data/test-twoNotesWithSameName.1.md`,
        'utf8',
      ),
    );
  });


  it('Enex file with internal links ', async () => {
    const options: YarleOptions = {
      enexSource: `${testDataFolder}test-links.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(`${__dirname}/../out/notes/test-links/NoteA.md`),
      true,
    );

    assert.equal(
      eol.auto(fs.readFileSync(
        `${__dirname}/../out/notes/test-links/NoteA.md`,
        'utf8',
      )),
      fs.readFileSync(`${__dirname}/data/test-linksNoteA.md`, 'utf8'),
    );

    assert.equal(
      fs.existsSync(`${__dirname}/../out/notes/test-links/NoteB.md`),
      true,
    );

    assert.equal(
      eol.auto(fs.readFileSync(
        `${__dirname}/../out/notes/test-links/NoteB.md`,
        'utf8',
      )),
      fs.readFileSync(`${__dirname}/data/test-linksNoteB.md`, 'utf8'),
    );
  });

  it('Enex file with internal links with extension', async () => {
    const options: YarleOptions = {
      enexSource: `${testDataFolder}test-links-withExtension.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
      addExtensionToInternalLinks: true,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(`${__dirname}/../out/notes/test-links-withExtension/NoteA.md`),
      true,
    );

    assert.equal(
      eol.auto(fs.readFileSync(
        `${__dirname}/../out/notes/test-links-withExtension/NoteA.md`,
        'utf8',
      )),
      fs.readFileSync(`${__dirname}/data/test-linksNoteA-withExtension.md`, 'utf8'),
    );

    assert.equal(
      fs.existsSync(`${__dirname}/../out/notes/test-links-withExtension/NoteB.md`),
      true,
    );

    assert.equal(
      eol.auto(fs.readFileSync(
        `${__dirname}/../out/notes/test-links-withExtension/NoteB.md`,
        'utf8',
      )),
      fs.readFileSync(`${__dirname}/data/test-linksNoteB-withExtension.md`, 'utf8'),
    );
  });

  it('Enex file with PDF attachment', async () => {
    const options: YarleOptions = {
      enexSource: `${testDataFolder}test-pdfAttachment.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-pdfAttachment/pdfAttachment.md`,
      ),
      true,
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-pdfAttachment/_resources/pdfAttachment.resources/sample.pdf`,
      ),
      true,
    );
  });
  it('Enex file with PDF attachment - ObsidianMD format', async () => {
    const options: YarleOptions = {
      enexSource: `${testDataFolder}test-pdfAttachment-ObsidianMD.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
      outputFormat: OutputFormat.ObsidianMD,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-pdfAttachment-ObsidianMD/pdfAttachment.md`,
      ),
      true,
    );
    assert.equal(
      eol.auto(fs.readFileSync(
        `${__dirname}/../out/notes/test-pdfAttachment-ObsidianMD/pdfAttachment.md`,
        'utf8',
      )),
      fs.readFileSync(`${__dirname}/data/test-pdfAttachment-ObsidianMD.md`, 'utf8'),
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-pdfAttachment-ObsidianMD/_resources/pdfAttachment.resources/sample.pdf`,
      ),
      true,
    );
  });
  it('Enex file with attachment - extension comes from mime', async () => {
    const options: YarleOptions = {
      enexSource: `${testDataFolder}test-scriptAttachment.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-scriptAttachment/scriptAttachment.md`,
      ),
      true,
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-scriptAttachment/_resources/scriptAttachment.resources/sample.scpt`,
      ),
      true,
    );
  });
  it('Enex file obsidian style', async () => {
    const options: YarleOptions = {
      enexSource: `${testDataFolder}test-twoNotes.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
      outputFormat: OutputFormat.ObsidianMD,
    };
    await yarle.dropTheRope(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-twoNotes/test - note with picture.md`,
      ),
      true,
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-twoNotes/_resources/test_-_note_with_picture.resources`,
      ),
      true,
    );

    assert.equal(
      eol.auto(fs.readFileSync(
        `${__dirname}/../out/notes/test-twoNotes/test - note with picture.md`,
        'utf8',
      )),
      fs.readFileSync(`${__dirname}/data/test-obsidianLink.md`, 'utf8'),
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/test-twoNotes/test -note with text only.md`,
      ),
      true,
    );

    assert.equal(
      eol.auto(fs.readFileSync(
        `${__dirname}/../out/notes/test-twoNotes/test -note with text only.md`,
        'utf8',
      )),
      fs.readFileSync(`${__dirname}/data/test-twoNotes-text.md`, 'utf8'),
    );
  });

  it('Folder of enex files', async () => {
    const options: YarleOptions = {
      enexSource: `${process.cwd()}/test/data/TestDirNotes`,
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
      outputFormat: OutputFormat.ObsidianMD,
      skipEnexFileNameFromOutputPath: true,
      templateFile: undefined,
    };

    await dropTheRopeRunner.run(options);
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/ExampleNoteInSameDir.md`,
      ),
      true,
    );
    assert.equal(
      fs.existsSync(
        `${__dirname}/../out/notes/ExampleNoteInSameDir.1.md`,
      ),
      true,
    );
  });

  it('case sensitive filenames', async () => {
    const options: YarleOptions = {
      enexSource: `${testDataFolder}test-case-sensitive.enex`,
      outputDir: 'out',
      templateFile: `${testDataFolder}bare_template.templ`,
      isMetadataNeeded: true,
      outputFormat: OutputFormat.ObsidianMD,
      skipEnexFileNameFromOutputPath: false,

    };
    await yarle.dropTheRope(options);
    const dirList = fs.readdirSync(`${__dirname}/../out/notes/test-case-sensitive/`);
    assert.equal(dirList.includes('TEST - templates just content.md'), true);

    assert.equal(
      eol.auto(fs.readFileSync(
        `${__dirname}/../out/notes/test-case-sensitive/TEST - templates just content.md`,
        'utf8',
      )),
      fs.readFileSync(
        `${__dirname}/data/test - templates just content.md`,
        'utf8',
      ),
    );
  });

});
