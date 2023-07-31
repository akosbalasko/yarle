import { YarleTest } from './yarle-test';
import { OutputFormat } from "../src/output-format";
import * as path from 'path';
import { YarleTestModifierOptions } from './yarle-test-modifier-options';

const dataFolder = `${path.sep}data${path.sep}`;
const testDataFolder = `${path.sep}test${dataFolder}`;

export const yarleTests: Array<YarleTest> = [
  {
    name: 'Enex file with note containing text only',
    options: {
      enexSources: [ `${__dirname}${path.sep}..${path.sep}${testDataFolder}test-justText.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-justText${path.sep}test -note with text only.md`,
    expectedOutputPath: `${dataFolder}test-justText.md`,
  },
  {
    name: 'Enex file with note containing text only - remove characters which break obsidian links',
    options: {
      enexSources: [ `${__dirname}${path.sep}..${path.sep}${testDataFolder}test-justText-linkbreakingNote.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-justText-linkbreakingNote${path.sep}test -note _with text only.md`,
    expectedOutputPath: `${dataFolder}test -note _with text only.md`,
  },
  {
    name: 'Enex file with note WithHyperlinkRefs',
    options: {
      enexSources: [ `.${testDataFolder}test-bracketlinks.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-bracketlinks${path.sep}test - bracketlinks.md`,
    expectedOutputPath: `${dataFolder}test-bracketlinks.md`,
  },

  {
    name: 'Enex file with note containing text only',
    options: {
      enexSources: [ `.${testDataFolder}test-justText.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-justText${path.sep}test -note with text only.md`,


    expectedOutputPath: `${dataFolder}test-justText.md`,
  },


  {
    name: 'Note with code block',
    options: {
      enexSources: [ `.${testDataFolder}test-noteWithCodeBlock.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
    },

    testOutputPath: `notes${path.sep}test-noteWithCodeBlock${path.sep}Note with code block.md`,


    expectedOutputPath: `${dataFolder}test-noteWithCodeBlock.md`,
  },


  {
    name: 'Note with tags',
    options: {
      enexSources: [ `.${testDataFolder}test-noteWithTags.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-noteWithTags${path.sep}test -note with text only.md`,

    expectedOutputPath: `${dataFolder}test-noteWithTags.md`,
  },

  {
    name: 'Note with nested tags',
    options: {
      enexSources: [ `.${testDataFolder}test-noteWithNestedTags.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      nestedTags: {
        separatorInEN: '_',
        replaceSeparatorWith: '/'
      },
      useHashTags: true
    },
    testOutputPath: `notes${path.sep}test-noteWithNestedTags${path.sep}test -note with text only.md`,

    expectedOutputPath: `${dataFolder}test-noteWithNestedTags.md`,
  },
  {
    name: 'Note with nested tags containing spaces',
    options: {
      enexSources: [ `.${testDataFolder}test-noteWithNestedTagsAndSpaces.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      nestedTags: {
        separatorInEN: '_',
        replaceSeparatorWith: '/'
      },
      useHashTags: true
    },
    testOutputPath: `notes${path.sep}test-noteWithNestedTagsAndSpaces${path.sep}test -note with text only.md`,

    expectedOutputPath: `${dataFolder}test-noteWithNestedTagsAndSpaces.md`,
  },

  {
    name: 'Note with nested tags containing spaces and a specific character to be replaced to',
    options: {
      enexSources: [ `.${testDataFolder}test-noteWithNestedTagsAndSpacesCustom.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      nestedTags: {
        separatorInEN: '_',
        replaceSeparatorWith: '/',
        replaceSpaceWith: '->'
      },
      useHashTags: true
    },
    testOutputPath: `notes${path.sep}test-noteWithNestedTagsAndSpacesCustom${path.sep}test -note with text only.md`,

    expectedOutputPath: `${dataFolder}test-noteWithNestedTagsAndSpacesCustom.md`,
  },
  {
    name: 'Note with notebook name',
    options: {
      enexSources: [ `.${testDataFolder}test-noteWithNotebookName.enex` ],
      templateFile: `.${testDataFolder}notebook-template.tmpl`,
      outputDir: 'out',
    },
    testOutputPath: `notes${path.sep}test-noteWithNotebookName${path.sep}test -note with text only.md`,
    expectedOutputPath: `${dataFolder}test-noteWithNotebookName.md`,
  },


  {
    name: 'Note with notebook name and tags',
    options: {
      enexSources: [ `.${testDataFolder}test-noteWithNotebookNameAndTags.enex` ],
      templateFile: `.${testDataFolder}notebook-template.tmpl`,
      outputDir: 'out',
    },
    testOutputPath: `notes${path.sep}test-noteWithNotebookNameAndTags${path.sep}test -note with text only.md`,
    expectedOutputPath: `${dataFolder}test-noteWithNotebookNameAndTags.md`,
  },


  {
    name: 'Note with zettelkastel id',
    options: {
      enexSources: [ `.${testDataFolder}test-noteWithZettelKasten.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      isZettelkastenNeeded: true,
      useZettelIdAsFilename: false
    },
    testOutputPath: `notes${path.sep}test-noteWithZettelKasten${path.sep}201810060943 test -note with text only.md`,


    expectedOutputPath: `${dataFolder}test-noteWithZettelKasten.md`,
  },

  {
    name: 'Note with zettelkastel id - use as filename',
    options: {
      enexSources: [ `.${testDataFolder}test-noteWithZettelKasten.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      isZettelkastenNeeded: true,

      useZettelIdAsFilename: true,
    },
    testOutputPath: `notes${path.sep}test-noteWithZettelKasten${path.sep}201810060943.md`,
    expectedOutputPath: `${dataFolder}test-noteWithZettelKasten.md`,
  },

  {
    name: 'Note with zettelkastel id - no title',
    options: {
      enexSources: [ `.${testDataFolder}test-noteWithZettelKasten-notitle.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      isZettelkastenNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-noteWithZettelKasten-notitle${path.sep}201810060943.md`,
    expectedOutputPath: `${dataFolder}test-noteWithZettelKasten-notitle.md`,

  },


  {
    name: 'Note without metadata',
    options: {
      enexSources: [ `.${testDataFolder}test-noteWithoutMetadata.enex` ],
      templateFile: `.${testDataFolder}nometadata-template.tmpl`,
      outputDir: 'out',
      isMetadataNeeded: false,
      isZettelkastenNeeded: false,
    },
    testOutputPath: `notes${path.sep}test-noteWithoutMetadata${path.sep}test -note without metadata.md`,
    expectedOutputPath: `${dataFolder}test-noteWithoutMetadata.md`,
  },


  {
    name: 'Note with latlong',
    options: {
      enexSources: [ `.${testDataFolder}test-noteWithLatLong.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-noteWithLatLong${path.sep}Test.md`,


    expectedOutputPath: `${dataFolder}test-noteWithLatLong.md`,
  },



  {
    name: 'Note with only source-url',
    options: {
      enexSources: [ `.${testDataFolder}test-noteWithSourceUrl.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-noteWithSourceUrl${path.sep}Test.md`,


    expectedOutputPath: `${dataFolder}test-noteWithSourceUrl.md`,
  },

  {
    name: 'Skips images without src attribute',
    options: {
      enexSources: [ `.${testDataFolder}test-imageWithoutSrc.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      turndownOptions: {headingStyle: 'setext'},
    },
    testOutputPath: `notes${path.sep}test-imageWithoutSrc${path.sep}test-imageWithoutSrc.md`,

    expectedOutputPath: `${dataFolder}test-imageWithoutSrc.md`,
  },

  {
    name: 'Enex file plaintextonly - skipping note that has resource in it',
    options: {
      enexSources: [ `.${testDataFolder}test-threePictures.enex` ],

      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: true,
    },
    testOutputPath: `notes${path.sep}test-threePictures${path.sep}test - note with more pictures.md`,
  },

  {
    name: ' Pure external url',
    options: {
      enexSources: [ `.${testDataFolder}test-pure-external-url.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      skipLocation: true,
    },
    testOutputPath: `notes${path.sep}test-pure-external-url${path.sep}pure-external-url.md`,

    expectedOutputPath: `${dataFolder}test-pure-external-url.md`,
  },


  {
    name: 'Enex file skip Location',
    options: {
      enexSources: [ `.${testDataFolder}test-skipLocation.enex` ],
      templateFile: `.${testDataFolder}nolocation-template.tmpl`,
      outputDir: 'out',
      isMetadataNeeded: true,
      skipLocation: true,
    },
    testOutputPath: `notes${path.sep}test-skipLocation${path.sep}SkipLocation.md`,

    expectedOutputPath: `${dataFolder}test-skipLocation.md`,
  },



  {
    name: 'Enex file with table',
    options: {
      enexSources: [ `.${testDataFolder}test-table.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    },
    testOutputPath: `notes${path.sep}test-table${path.sep}table.md`,
    expectedOutputPath: `${dataFolder}test-table.md`,
  },


  {
    name: 'Enex file with specialItems',
    options: {
      enexSources: [ `.${testDataFolder}test-specialItems.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    },
    testOutputPath: `notes${path.sep}test-specialItems${path.sep}special items.md`,

    expectedOutputPath: `${dataFolder}test-specialItems.md`,
  },


  {
    name: 'Enex file with links ',
    options: {
      enexSources: [ `.${testDataFolder}test-externalLink.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    },
    testOutputPath: `notes${path.sep}test-externalLink${path.sep}External Link.md`,
    expectedOutputPath: `${dataFolder}test-externalLink.md`,
  },


  {
    name: 'Enex file with links, pure link (no text) ',
    options: {
      enexSources: [ `.${testDataFolder}test-externalLink-notext.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    },
    testOutputPath: `notes${path.sep}test-externalLink-notext${path.sep}External Link.md`,

    expectedOutputPath: `${dataFolder}test-externalLink-notext.md`,
  },


  {
    name: 'Enex file with file links ',
    options: {
      enexSources: [ `.${testDataFolder}test-externalFileLink.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    },
    testOutputPath: `notes${path.sep}test-externalFileLink${path.sep}External File Link.md`,

    expectedOutputPath: `${dataFolder}test-externalFileLink.md`,
  },


  {
    name: 'Enex file with links with resources',
    options: {
      enexSources: [ `.${testDataFolder}test-externalLinkWithPicture.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    },
    testOutputPath: `notes${path.sep}test-externalLinkWithPicture${path.sep}Link With Picture.md`,

    expectedOutputPath: `${dataFolder}test-externalLinkWithPicture.md`,

  },




  {
    name: 'Enex file with highlighted text',
    options: {
      enexSources: [ `.${testDataFolder}test-highlights.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    },
    testOutputPath: `notes${path.sep}test-highlights${path.sep}Highlights.md`,

    expectedOutputPath: `${dataFolder}test-highlights.md`,
  },

  {
    name: 'Enex file with highlighted text - Obsidian-style',
    options: {
      enexSources: [ `.${testDataFolder}test-highlights.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
      outputFormat: OutputFormat.ObsidianMD,
    },

    testOutputPath: `notes${path.sep}test-highlights${path.sep}Highlights.md`,

    expectedOutputPath: `${dataFolder}test-highlightsObsidian.md`,
  },

  {
    name: 'Enex file with highlighted text - 2nd implementation',
    options: {
      enexSources: [ `.${testDataFolder}test-highlights2.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
      outputFormat: OutputFormat.ObsidianMD,
    },
    testOutputPath: `notes${path.sep}test-highlights2${path.sep}Highlights impl2.md`,

    expectedOutputPath: `${dataFolder}test-highlightsImpl2.md`,
  },

  {
    name: 'Enex file - no span style',
    options: {
      enexSources: [ `.${testDataFolder}test-nospanstyle.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
      outputFormat: OutputFormat.ObsidianMD,
      keepMDCharactersOfENNotes: false,
    }
    ,

    testOutputPath: `notes${path.sep}test-nospanstyle${path.sep}test-nospanstyle.md`,
    expectedOutputPath: `${dataFolder}test-nospanstyle.md`,
  },

  {
    name: 'Note with strikethrough',
    options: {
      enexSources: [ `.${testDataFolder}test-strikethrough.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-strikethrough${path.sep}test - strikethrough.md`,

    expectedOutputPath: `${dataFolder}test-strikethrough.md`,
  },

  {
    name: 'Note with sublists',
    options: {
      enexSources: [ `.${testDataFolder}test-sublists.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-sublists${path.sep}test - sublists.md`,

    expectedOutputPath: `${dataFolder}test-sublists.md`,
  },

  {
    name: 'Note empty en-todo',
    options: {
      enexSources: [ `.${testDataFolder}test-empty-en-todo.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-empty-en-todo${path.sep}test-empty-en-todo.md`,

    expectedOutputPath: `${dataFolder}test-empty-en-todo.md`,
  },
  {
    name: 'Note checkboxes',
    options: {
      enexSources: [ `.${testDataFolder}test-checkboxes.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-checkboxes${path.sep}checkboxes.md`,
    expectedOutputPath: `${dataFolder}test-checkboxes.md`,
  },
  {
    name: 'Note with sublists (valid html)',
    options: {
      enexSources: [ `.${testDataFolder}test-sublists-valid.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-sublists-valid${path.sep}test - sublists - valid.md`,
    expectedOutputPath: `${dataFolder}test-sublists-valid.md`,
  },

  {
    name: 'Note with sublists (invalid html)',
    options: {
      enexSources: [ `.${testDataFolder}test-sublists-invalid.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-sublists-invalid${path.sep}Test note.md`,
    expectedOutputPath: `${dataFolder}test-sublists-invalid.md`,
  },

  {
    name: 'Note with headings - default turndown options',
    options: {
      enexSources: [ `.${testDataFolder}test-headings.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-headings${path.sep}test - headings.md`,
    expectedOutputPath: `${dataFolder}test-headings.md`,
  },

  {
    name: 'Note with headings - config turndown options',
    options: {
      enexSources: [ `.${testDataFolder}test-headings.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      turndownOptions: {headingStyle: 'setext'},
    },
    testOutputPath: `notes${path.sep}test-headings${path.sep}test - headings.md`,

    expectedOutputPath: `${dataFolder}test-headings-setext.md`,
  },
  {
    name: 'Note with checklists',
    options: {
      enexSources: [ `.${testDataFolder}test-checklist.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-checklist${path.sep}test-checkbox.v10.48.md`,
    expectedOutputPath: `${dataFolder}test-checklist.md`,
  },

  {
    name: 'Enex file urlEncode whitespace',
    options: {
      enexSources: [ `.${testDataFolder}test-urlencode.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      urlEncodeFileNamesAndLinks: true,
    },
    testOutputPath: `notes${path.sep}test-urlencode${path.sep}test - note with picture (filename with spaces).md`,

    expectedOutputPath: `${dataFolder}test-urlencode.md`,
  },

  {
    name: 'Note with sublists (multiple)',
    options: {
      enexSources: [ `.${testDataFolder}test-sublists-multiple.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-sublists-multiple${path.sep}test - sublists - multiple.md`,

    expectedOutputPath: `${dataFolder}test-sublists-multiple.md`,
  },

  {
    name: 'Note with lists (simple)',
    options: {
      enexSources: [ `.${testDataFolder}test-list.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-list${path.sep}test - list.md`,
    expectedOutputPath: `${dataFolder}test-list.md`,

  },

  {
    name: 'Webclip - article',
    options: {
      enexSources: [ `.${testDataFolder}test-webclip_article.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      turndownOptions: {headingStyle: 'setext'},
      plainTextNotesOnly: false,
      outputFormat: OutputFormat.ObsidianMD,
    },
    testOutputPath: `notes${path.sep}test-webclip_article${path.sep}yarle evernote.md`,

    expectedOutputPath: `${dataFolder}test-webclip_article.md`,
  },


  {
    name: 'Webclip - simplified article',
    options: {
      enexSources: [ `.${testDataFolder}test-webclip_simplifiedarticle.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      turndownOptions: {headingStyle: 'setext'},
      plainTextNotesOnly: false,
      outputFormat: OutputFormat.ObsidianMD,
    },
    testOutputPath: `notes${path.sep}test-webclip_simplifiedarticle${path.sep}yarle evernote.md`,
    expectedOutputPath: `${dataFolder}test-webclip_simplifiedarticle.md`,

  },


  {
    name: 'Webclip - bookmark',
    options: {
      enexSources: [ `.${testDataFolder}test-webclip_bookmark.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      turndownOptions: {headingStyle: 'setext'},
      plainTextNotesOnly: false,
      outputFormat: OutputFormat.ObsidianMD,
    }
    ,

    testOutputPath: `notes${path.sep}test-webclip_bookmark${path.sep}Yarle.md`,

    expectedOutputPath: `${dataFolder}test-webclip_bookmark.md`,
  },
  {
    name: 'Webclip - screenshot',
    options: {
      enexSources: [ `.${testDataFolder}test-webclip_screenshot.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
      outputFormat: OutputFormat.ObsidianMD,
    }
    ,

    testOutputPath: `notes${path.sep}test-webclip_screenshot${path.sep}Yarle.md`,

    expectedOutputPath: `${dataFolder}test-webclip_screenshot.md`,
  },



  {
    name: 'applies template passed as parameter',
    options: {
      enexSources: [ `.${testDataFolder}test-template.enex` ],
      outputDir: 'out',
      templateFile: `.${testDataFolder}template_tags_bottom.templ`,
      isMetadataNeeded: true,
      outputFormat: OutputFormat.ObsidianMD,
      skipEnexFileNameFromOutputPath: false,
    },
    testOutputPath: `notes${path.sep}test-template${path.sep}test - templates.md`,
    expectedOutputPath: `${dataFolder}test - templates.md`,
  },


  {
    name: 'applies template passed as parameter - skip metadata if it doesn\'t exists',
    options: {
      enexSources: [ `.${testDataFolder}test-template-nometa.enex` ],
      outputDir: 'out',
      templateFile: `.${testDataFolder}template_tags_bottom.templ`,
      isMetadataNeeded: true,
      outputFormat: OutputFormat.ObsidianMD,
      skipEnexFileNameFromOutputPath: false,
      skipLocation: false,
      skipSourceUrl: false,
      skipCreationTime: false,
      skipUpdateTime: false,
      skipTags: false,
      useHashTags: true,
    },
    testOutputPath: `notes${path.sep}test-template-nometa${path.sep}TEST - templates.md`,

    expectedOutputPath: `${dataFolder}test - templates-nometa.md`,
  },


  {
    name: 'only renders content with a template with just the content block',
    options: {
      enexSources: [ `.${testDataFolder}test-template 2.enex` ],
      outputDir: 'out',
      templateFile: `.${testDataFolder}bare_template.templ`,
      isMetadataNeeded: true,
      outputFormat: OutputFormat.ObsidianMD,
      skipEnexFileNameFromOutputPath: false,

    },
    testOutputPath: `notes${path.sep}test-template 2${path.sep}test - templates just content.md`,
    expectedOutputPath: `${dataFolder}test - templates just content.md`,

  },



  {
    name: 'monospace code blocks',
    options: {
      enexSources: [ `.${testDataFolder}test-monospace-codeblocks.enex` ],
      outputDir: 'out',
      templateFile: `.${testDataFolder}bare_template.templ`,
      isMetadataNeeded: true,
      outputFormat: OutputFormat.ObsidianMD,
      skipEnexFileNameFromOutputPath: false,
      monospaceIsCodeBlock: true,

    },

    testOutputPath: `notes${path.sep}test-monospace-codeblocks${path.sep}test-monospace-codeblocks.md`,
    expectedOutputPath: `${dataFolder}test-monospace-codeblocks.md`,

  },



  {
    name: 'keep Markdown characters - noop escape function in turndown',
    options: {
      enexSources: [ `.${testDataFolder}test-markdown-en.enex` ],
      outputDir: 'out',
      templateFile: `.${testDataFolder}bare_template.templ`,
      isMetadataNeeded: true,
      outputFormat: OutputFormat.ObsidianMD,
      skipEnexFileNameFromOutputPath: false,
      keepMDCharactersOfENNotes: true,

    },
    testOutputPath: `notes${path.sep}test-markdown-en${path.sep}test-markdown-en.md`,
    expectedOutputPath: `${dataFolder}test-markdown-en.md`,

  },
  {
    name: ' Pure external url with unescapeable characters',
    options: {
      enexSources: [ `.${testDataFolder}test-externalLink-escape.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      skipLocation: true,
      keepMDCharactersOfENNotes: true,
    },
    testOutputPath: `notes${path.sep}test-externalLink-escape${path.sep}External Link.md`,

    expectedOutputPath: `${dataFolder}test-externalLink-escape.md`,
  },
  {
    name: ' Pure external url naked',
    options: {
      enexSources: [ `.${testDataFolder}test-externalLink-naked.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      skipLocation: true,
      keepMDCharactersOfENNotes: true,
      generateNakedUrls: true,
    },
    testOutputPath: `notes${path.sep}test-externalLink-naked${path.sep}External Link.md`,

    expectedOutputPath: `${dataFolder}test-externalLink-naked.md`,
  },

  {
    name: ' Custom date format',
    options: {
      enexSources: [ `.${testDataFolder}test-justTextButCustomDate.enex` ],
      outputDir: 'out',
      isMetadataNeeded: true,
      skipLocation: true,
      keepMDCharactersOfENNotes: true,
      dateFormat: 'YYYY-MM-DD',
    },
    testOutputPath: `notes${path.sep}test-justTextButCustomDate${path.sep}test -note with text only.md`,
    expectedOutputPath: `${dataFolder}test-justTextButCustomDate.md`,
  },
  {
    name: 'multiple metadata content',
    options: {
      enexSources: [ `.${testDataFolder}test-noteWithTags.enex` ],
      outputDir: 'out',
      templateFile: `.${testDataFolder}multimeta-template.tmpl`,
      isMetadataNeeded: true,
      outputFormat: OutputFormat.ObsidianMD,
      skipEnexFileNameFromOutputPath: false,
      keepMDCharactersOfENNotes: true,

    },
    testOutputPath: `notes${path.sep}test-noteWithTags${path.sep}test -note with text only.md`,
    expectedOutputPath: `${dataFolder}test-noteWithTags-multi.md`,

  },
  {
    name: 'multiple metadata content',
    options: {
      enexSources: [ `.${testDataFolder}test-intend-newlines.enex` ],
      outputDir: 'out',
      templateFile: `.${testDataFolder}multimeta-template.tmpl`,
      isMetadataNeeded: true,
      outputFormat: OutputFormat.ObsidianMD,
      skipEnexFileNameFromOutputPath: false,
      keepMDCharactersOfENNotes: true,
      keepOriginalAmountOfNewlines: true,

    },
    testOutputPath: `notes${path.sep}test-intend-newlines${path.sep}test -note with text only.md`,
    expectedOutputPath: `${dataFolder}test-intend-newlines.md`,
  },
  {
    name: 'hanging enex',
    options: {
      enexSources: [ `.${testDataFolder}huge-html.enex` ],
      outputDir: 'out',
      templateFile: `.${testDataFolder}multimeta-template.tmpl`,
      isMetadataNeeded: true,
      turndownOptions: {headingStyle: 'setext'},
      outputFormat: OutputFormat.ObsidianMD,
      skipEnexFileNameFromOutputPath: false,
      keepMDCharactersOfENNotes: true,

    },
    testOutputPath: `notes${path.sep}huge-html${path.sep}Untitled Note.md`,
    expectedOutputPath: `${dataFolder}test-hugeHtml.md`,

  },
]
