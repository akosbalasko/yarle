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
      enexSource: `${__dirname}${path.sep}..${path.sep}${testDataFolder}test-justText.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-justText${path.sep}test -note with text only.md`,
    expectedOutputPath: `${dataFolder}test-justText.md`,
  },

  {
    name: 'Enex file with note WithHyperlinkRefs',
    options: {
      enexSource: `.${testDataFolder}test-bracketlinks.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-bracketlinks${path.sep}test - bracketlinks.md`,
    expectedOutputPath: `${dataFolder}test-bracketlinks.md`,
  },


  {
    name: 'Enex file with note containing text only',
    options: {
      enexSource: `.${testDataFolder}test-justText.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-justText${path.sep}test -note with text only.md`,


    expectedOutputPath: `${dataFolder}test-justText.md`,
  },


  {
    name: 'Note with code block',
    options: {
      enexSource: `.${testDataFolder}test-noteWithCodeBlock.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
    },

    testOutputPath: `notes${path.sep}test-noteWithCodeBlock${path.sep}Note with code block.md`,


    expectedOutputPath: `${dataFolder}test-noteWithCodeBlock.md`,
  },


  {
    name: 'Note with tags',
    options: {
      enexSource: `.${testDataFolder}test-noteWithTags.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-noteWithTags${path.sep}test -note with text only.md`,

    expectedOutputPath: `${dataFolder}test-noteWithTags.md`,
  },

  {
    name: 'Note with nested tags',
    options: {
      enexSource: `.${testDataFolder}test-noteWithNestedTags.enex`,
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
      enexSource: `.${testDataFolder}test-noteWithNestedTagsAndSpaces.enex`,
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
      enexSource: `.${testDataFolder}test-noteWithNestedTagsAndSpacesCustom.enex`,
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
      enexSource: `.${testDataFolder}test-noteWithNotebookName.enex`,
      templateFile: `.${testDataFolder}notebook-template.tmpl`,
      outputDir: 'out',
    },
    testOutputPath: `notes${path.sep}test-noteWithNotebookName${path.sep}test -note with text only.md`,
    expectedOutputPath: `${dataFolder}test-noteWithNotebookName.md`,
  },


  {
    name: 'Note with notebook name and tags',
    options: {
      enexSource: `.${testDataFolder}test-noteWithNotebookNameAndTags.enex`,
      templateFile: `.${testDataFolder}notebook-template.tmpl`,
      outputDir: 'out',
    },
    testOutputPath: `notes${path.sep}test-noteWithNotebookNameAndTags${path.sep}test -note with text only.md`,
    expectedOutputPath: `${dataFolder}test-noteWithNotebookNameAndTags.md`,
  },


  {
    name: 'Note with zettelkastel id',
    options: {
      enexSource: `.${testDataFolder}test-noteWithZettelKasten.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
      isZettelkastenNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-noteWithZettelKasten${path.sep}201810060943 test -note with text only.md`,


    expectedOutputPath: `${dataFolder}test-noteWithZettelKasten.md`,
  },


  {
    name: 'Note with zettelkastel id - no title',
    options: {
      enexSource: `.${testDataFolder}test-noteWithZettelKasten-notitle.enex`,
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
      enexSource: `.${testDataFolder}test-noteWithoutMetadata.enex`,
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
      enexSource: `.${testDataFolder}test-noteWithLatLong.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-noteWithLatLong${path.sep}Test.md`,


    expectedOutputPath: `${dataFolder}test-noteWithLatLong.md`,
  },



  {
    name: 'Note with only source-url',
    options: {
      enexSource: `.${testDataFolder}test-noteWithSourceUrl.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-noteWithSourceUrl${path.sep}Test.md`,


    expectedOutputPath: `${dataFolder}test-noteWithSourceUrl.md`,
  },

  {
    name: 'Skips images without src attribute',
    options: {
      enexSource: `.${testDataFolder}test-imageWithoutSrc.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-imageWithoutSrc${path.sep}test-imageWithoutSrc.md`,

    expectedOutputPath: `${dataFolder}test-imageWithoutSrc.md`,
  },

  {
    name: 'Enex file plaintextonly - skipping note that has resource in it',
    options: {
      enexSource: `.${testDataFolder}test-threePictures.enex`,

      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: true,
    },
    testOutputPath: `notes${path.sep}test-threePictures${path.sep}test - note with more pictures.md`,
  },

  {
    name: ' Pure external url',
    options: {
      enexSource: `.${testDataFolder}test-pure-external-url.enex`,
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
      enexSource: `.${testDataFolder}test-skipLocation.enex`,
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
      enexSource: `.${testDataFolder}test-table.enex`,
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
      enexSource: `.${testDataFolder}test-specialItems.enex`,
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
      enexSource: `.${testDataFolder}test-externalLink.enex`,
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
      enexSource: `.${testDataFolder}test-externalLink-notext.enex`,
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
      enexSource: `.${testDataFolder}test-externalFileLink.enex`,
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
      enexSource: `.${testDataFolder}test-externalLinkWithPicture.enex`,
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
      enexSource: `.${testDataFolder}test-highlights.enex`,
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
      enexSource: `.${testDataFolder}test-highlights.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
      outputFormat: OutputFormat.ObsidianMD,
    },

    testOutputPath: `notes${path.sep}test-highlights${path.sep}Highlights.md`,

    expectedOutputPath: `${dataFolder}test-highlightsObsidian.md`,
  },


  {
    name: 'Enex file - no span style',
    options: {
      enexSource: `.${testDataFolder}test-nospanstyle.enex`,
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
    name: 'Note with sublists',
    options: {
      enexSource: `.${testDataFolder}test-sublists.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-sublists${path.sep}test - sublists.md`,

    expectedOutputPath: `${dataFolder}test-sublists.md`,
  },

  {
    name: 'Note with sublists (valid html)',
    options: {
      enexSource: `.${testDataFolder}test-sublists-valid.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-sublists-valid${path.sep}test - sublists - valid.md`,

    expectedOutputPath: `${dataFolder}test-sublists-valid.md`,
  },

  {
    name: 'Enex file urlEncode whitespace',
    options: {
      enexSource: `.${testDataFolder}test-urlencode.enex`,
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
      enexSource: `.${testDataFolder}test-sublists-multiple.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: `notes${path.sep}test-sublists-multiple${path.sep}test - sublists - multiple.md`,

    expectedOutputPath: `${dataFolder}test-sublists-multiple.md`,
  },


  {
    name: 'Webclip - article',
    options: {
      enexSource: `.${testDataFolder}test-webclip_article.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
      outputFormat: OutputFormat.ObsidianMD,
    },
    testOutputPath: `notes${path.sep}test-webclip_article${path.sep}yarle evernote.md`,

    expectedOutputPath: `${dataFolder}test-webclip_article.md`,
  },


  {
    name: 'Webclip - simplified article',
    options: {
      enexSource: `.${testDataFolder}test-webclip_simplifiedarticle.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
      outputFormat: OutputFormat.ObsidianMD,
    },
    testOutputPath: `notes${path.sep}test-webclip_simplifiedarticle${path.sep}yarle evernote.md`,
    expectedOutputPath: `${dataFolder}test-webclip_simplifiedarticle.md`,

  },


  {
    name: 'Webclip - bookmark',
    options: {
      enexSource: `.${testDataFolder}test-webclip_bookmark.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
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
      enexSource: `.${testDataFolder}test-webclip_screenshot.enex`,
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
      enexSource: `.${testDataFolder}test-template.enex`,
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
      enexSource: `.${testDataFolder}test-template-nometa.enex`,
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
      enexSource: `.${testDataFolder}test-template 2.enex`,
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
      enexSource: `.${testDataFolder}test-monospace-codeblocks.enex`,
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
      enexSource: `.${testDataFolder}test-markdown-en.enex`,
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
      enexSource: `.${testDataFolder}test-externalLink-escape.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
      skipLocation: true,
      keepMDCharactersOfENNotes: true,
    },
    testOutputPath: `notes${path.sep}test-externalLink-escape${path.sep}External Link.md`,

    expectedOutputPath: `${dataFolder}test-externalLink-escape.md`,
  },

  {
    name: ' Custom date format',
    options: {
      enexSource: `.${testDataFolder}test-justTextButCustomDate.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
      skipLocation: true,
      keepMDCharactersOfENNotes: true,
      dateFormat: 'YYYY MMMM DD',
    },
    testOutputPath: `notes${path.sep}test-justTextButCustomDate${path.sep}test -note with text only.md`,
    expectedOutputPath: `${dataFolder}test-justTextButCustomDate.md`,
  },
  {
    name: 'multiple metadata content',
    options: {
      enexSource: `.${testDataFolder}test-noteWithTags.enex`,
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
      enexSource: `.${testDataFolder}test-intend-newlines.enex`,
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
      enexSource: `.${testDataFolder}huge-html.enex`,
      outputDir: 'out',
      templateFile: `.${testDataFolder}multimeta-template.tmpl`,
      isMetadataNeeded: true,
      outputFormat: OutputFormat.ObsidianMD,
      skipEnexFileNameFromOutputPath: false,
      keepMDCharactersOfENNotes: true,

    },
    testOutputPath: `notes${path.sep}huge-html${path.sep}Untitled Note.md`,
    expectedOutputPath: `${dataFolder}test-hugeHtml.md`,


  },
]