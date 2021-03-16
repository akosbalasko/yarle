import { YarleTest } from './yarle-test';
import { OutputFormat } from "../src/output-format";
import { YarleTestModifierOptions } from './yarle-test-modifier-options';

export const yarleTests: Array<YarleTest> = [
  {
    name: 'Enex file with note containing text only',
    options: {
      enexSource: `${__dirname}/../test/data/test-justText.enex`,
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: 'notes/test-justText/test -note with text only.md',
    expectedOutputPath: '/data/test-justText.md',
  },

  {
    name: 'Enex file with note WithHyperlinkRefs',
    options: {
      enexSource: './test/data/test-bracketlinks.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: 'notes/test-bracketlinks/test - bracketlinks.md',
    expectedOutputPath: '/data/test-bracketlinks.md',
  },


  {
    name: 'Enex file with note containing text only',
    options: {
      enexSource: './test/data/test-justText.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: 'notes/test-justText/test -note with text only.md',


    expectedOutputPath: '/data/test-justText.md',
  },


  {
    name: 'Note with code block',
    options: {
      enexSource: './test/data/test-noteWithCodeBlock.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
    },

    testOutputPath: 'notes/test-noteWithCodeBlock/Note with code block.md',


    expectedOutputPath: '/data/test-noteWithCodeBlock.md',
  },


  {
    name: 'Note with tags',
    options: {
      enexSource: './test/data/test-noteWithTags.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: 'notes/test-noteWithTags/test -note with text only.md',

    expectedOutputPath: '/data/test-noteWithTags.md',
  },

  {
    name: 'Note with nested tags',
    options: {
      enexSource: './test/data/test-noteWithNestedTags.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      nestedTags: {
        separatorInEN: '_',
        replaceSeparatorWith: '/'
      },
      useHashTags: true
    },
    testOutputPath: 'notes/test-noteWithNestedTags/test -note with text only.md',

    expectedOutputPath: '/data/test-noteWithNestedTags.md',
  },
  {
    name: 'Note with nested tags containing spaces',
    options: {
      enexSource: './test/data/test-noteWithNestedTagsAndSpaces.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      nestedTags: {
        separatorInEN: '_',
        replaceSeparatorWith: '/'
      },
      useHashTags: true
    },
    testOutputPath: 'notes/test-noteWithNestedTagsAndSpaces/test -note with text only.md',

    expectedOutputPath: '/data/test-noteWithNestedTagsAndSpaces.md',
  },

  {
    name: 'Note with nested tags containing spaces and a specific character to be replaced to',
    options: {
      enexSource: './test/data/test-noteWithNestedTagsAndSpacesCustom.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      nestedTags: {
        separatorInEN: '_',
        replaceSeparatorWith: '/',
        replaceSpaceWith: '->'
      },
      useHashTags: true
    },
    testOutputPath: 'notes/test-noteWithNestedTagsAndSpacesCustom/test -note with text only.md',

    expectedOutputPath: '/data/test-noteWithNestedTagsAndSpacesCustom.md',
  },
  {
    name: 'Note with notebook name',
    options: {
      enexSource: './test/data/test-noteWithNotebookName.enex',
      templateFile: './test/data/notebook-template.tmpl',
      outputDir: 'out',
    },
    testOutputPath: 'notes/test-noteWithNotebookName/test -note with text only.md',
    expectedOutputPath: '/data/test-noteWithNotebookName.md',
  },


  {
    name: 'Note with notebook name and tags',
    options: {
      enexSource: './test/data/test-noteWithNotebookNameAndTags.enex',
      templateFile: './test/data/notebook-template.tmpl',
      outputDir: 'out',
    },
    testOutputPath: 'notes/test-noteWithNotebookNameAndTags/test -note with text only.md',
    expectedOutputPath: '/data/test-noteWithNotebookNameAndTags.md',
  },


  {
    name: 'Note with zettelkastel id',
    options: {
      enexSource: './test/data/test-noteWithZettelKasten.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      isZettelkastenNeeded: true,
    },
    testOutputPath: 'notes/test-noteWithZettelKasten/201810060943 test -note with text only.md',


    expectedOutputPath: '/data/test-noteWithZettelKasten.md',
  },


  {
    name: 'Note with zettelkastel id - no title',
    options: {
      enexSource: './test/data/test-noteWithZettelKasten-notitle.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      isZettelkastenNeeded: true,
    },
    testOutputPath: 'notes/test-noteWithZettelKasten-notitle/201810060943.md',
    expectedOutputPath: '/data/test-noteWithZettelKasten-notitle.md',

  },


  {
    name: 'Note without metadata',
    options: {
      enexSource: './test/data/test-noteWithoutMetadata.enex',
      templateFile: './test/data/nometadata-template.tmpl',
      outputDir: 'out',
      isMetadataNeeded: false,
      isZettelkastenNeeded: false,
    },
    testOutputPath: 'notes/test-noteWithoutMetadata/test -note without metadata.md',
    expectedOutputPath: '/data/test-noteWithoutMetadata.md',
  },


  {
    name: 'Note with latlong',
    options: {
      enexSource: './test/data/test-noteWithLatLong.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: 'notes/test-noteWithLatLong/Test.md',


    expectedOutputPath: '/data/test-noteWithLatLong.md',
  },



  {
    name: 'Note with only source-url',
    options: {
      enexSource: './test/data/test-noteWithSourceUrl.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: 'notes/test-noteWithSourceUrl/Test.md',


    expectedOutputPath: '/data/test-noteWithSourceUrl.md',
  },

  {
    name: 'Skips images without src attribute',
    options: {
      enexSource: './test/data/test-imageWithoutSrc.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: 'notes/test-imageWithoutSrc/test-imageWithoutSrc.md',

    expectedOutputPath: '/data/test-imageWithoutSrc.md',
  },

  {
    name: 'Enex file plaintextonly - skipping note that has resource in it',
    options: {
      enexSource: './test/data/test-threePictures.enex',

      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: true,
    },
    testOutputPath: 'notes/test-threePictures/test - note with more pictures.md',
  },

  {
    name: ' Pure external url',
    options: {
      enexSource: './test/data/test-pure-external-url.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      skipLocation: true,
    },
    testOutputPath: 'notes/test-pure-external-url/pure-external-url.md',

    expectedOutputPath: '/data/test-pure-external-url.md',
  },


  {
    name: 'Enex file skip Location',
    options: {
      enexSource: './test/data/test-skipLocation.enex',
      templateFile: './test/data/nolocation-template.tmpl',
      outputDir: 'out',
      isMetadataNeeded: true,
      skipLocation: true,
    },
    testOutputPath: 'notes/test-skipLocation/SkipLocation.md',

    expectedOutputPath: '/data/test-skipLocation.md',
  },



  {
    name: 'Enex file with table',
    options: {
      enexSource: './test/data/test-table.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    },
    testOutputPath: 'notes/test-table/table.md',
    expectedOutputPath: '/data/test-table.md',
  },


  {
    name: 'Enex file with specialItems',
    options: {
      enexSource: './test/data/test-specialItems.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    },
    testOutputPath: 'notes/test-specialItems/special items.md',

    expectedOutputPath: '/data/test-specialItems.md',
  },


  {
    name: 'Enex file with links ',
    options: {
      enexSource: './test/data/test-externalLink.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    },
    testOutputPath: 'notes/test-externalLink/External Link.md',
    expectedOutputPath: '/data/test-externalLink.md',
  },


  {
    name: 'Enex file with links, pure link (no text) ',
    options: {
      enexSource: './test/data/test-externalLink-notext.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    },
    testOutputPath: 'notes/test-externalLink-notext/External Link.md',

    expectedOutputPath: '/data/test-externalLink-notext.md',
  },


  {
    name: 'Enex file with file links ',
    options: {
      enexSource: './test/data/test-externalFileLink.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    },
    testOutputPath: 'notes/test-externalFileLink/External File Link.md',

    expectedOutputPath: '/data/test-externalFileLink.md',
  },


  {
    name: 'Enex file with links with resources',
    options: {
      enexSource: './test/data/test-externalLinkWithPicture.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    },
    testOutputPath: 'notes/test-externalLinkWithPicture/Link With Picture.md',

    expectedOutputPath: '/data/test-externalLinkWithPicture.md',

  },




  {
    name: 'Enex file with highlighted text',
    options: {
      enexSource: './test/data/test-highlights.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
    },
    testOutputPath: 'notes/test-highlights/Highlights.md',

    expectedOutputPath: '/data/test-highlights.md',
  },

  {
    name: 'Enex file with highlighted text - Obsidian-style',
    options: {
      enexSource: './test/data/test-highlights.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
      outputFormat: OutputFormat.ObsidianMD,
    },

    testOutputPath: 'notes/test-highlights/Highlights.md',

    expectedOutputPath: '/data/test-highlightsObsidian.md',
  },


  {
    name: 'Enex file - no span style',
    options: {
      enexSource: './test/data/test-nospanstyle.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
      outputFormat: OutputFormat.ObsidianMD,
      keepMDCharactersOfENNotes: false,
    }
    ,

    testOutputPath: 'notes/test-nospanstyle/test-nospanstyle.md',

    expectedOutputPath: '/data/test-nospanstyle.md',
  },


  {
    name: 'Note with sublists',
    options: {
      enexSource: './test/data/test-sublists.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: 'notes/test-sublists/test - sublists.md',

    expectedOutputPath: '/data/test-sublists.md',
  },

  {
    name: 'Note with sublists (valid html)',
    options: {
      enexSource: './test/data/test-sublists-valid.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: 'notes/test-sublists-valid/test - sublists - valid.md',

    expectedOutputPath: '/data/test-sublists-valid.md',
  },

  {
    name: 'Enex file urlEncode whitespace',
    options: {
      enexSource: './test/data/test-urlencode.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      urlEncodeFileNamesAndLinks: true,
    },
    testOutputPath: 'notes/test-urlencode/test - note with picture (filename with spaces).md',

    expectedOutputPath: '/data/test-urlencode.md',
  },

  {
    name: 'Note with sublists (multiple)',
    options: {
      enexSource: './test/data/test-sublists-multiple.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
    },
    testOutputPath: 'notes/test-sublists-multiple/test - sublists - multiple.md',

    expectedOutputPath: '/data/test-sublists-multiple.md',
  },


  {
    name: 'Webclip - article',
    options: {
      enexSource: './test/data/test-webclip_article.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
      outputFormat: OutputFormat.ObsidianMD,
    },
    testOutputPath: 'notes/test-webclip_article/yarle evernote.md',

    expectedOutputPath: '/data/test-webclip_article.md',
  },


  {
    name: 'Webclip - simplified article',
    options: {
      enexSource: './test/data/test-webclip_simplifiedarticle.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
      outputFormat: OutputFormat.ObsidianMD,
    },
    testOutputPath: 'notes/test-webclip_simplifiedarticle/yarle evernote.md',
    expectedOutputPath: '/data/test-webclip_simplifiedarticle.md',

  },


  {
    name: 'Webclip - bookmark',
    options: {
      enexSource: './test/data/test-webclip_bookmark.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
      outputFormat: OutputFormat.ObsidianMD,
    }
    ,

    testOutputPath: 'notes/test-webclip_bookmark/Yarle.md',

    expectedOutputPath: '/data/test-webclip_bookmark.md',
  },


  {
    name: 'Webclip - screenshot',
    options: {
      enexSource: './test/data/test-webclip_screenshot.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      plainTextNotesOnly: false,
      outputFormat: OutputFormat.ObsidianMD,
    }
    ,

    testOutputPath: 'notes/test-webclip_screenshot/Yarle.md',

    expectedOutputPath: '/data/test-webclip_screenshot.md',
  },



  {
    name: 'applies template passed as parameter',
    options: {
      enexSource: './test/data/test-template.enex',
      outputDir: 'out',
      templateFile: './test/data/template_tags_bottom.templ',
      isMetadataNeeded: true,
      outputFormat: OutputFormat.ObsidianMD,
      skipEnexFileNameFromOutputPath: false,
    },
    testOutputPath: 'notes/test-template/test - templates.md',
    expectedOutputPath: '/data/test - templates.md',
  },


  {
    name: 'applies template passed as parameter - skip metadata if it doesn\'t exists',
    options: {
      enexSource: './test/data/test-template-nometa.enex',
      outputDir: 'out',
      templateFile: './test/data/template_tags_bottom.templ',
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
    testOutputPath: 'notes/test-template-nometa/TEST - templates.md',

    expectedOutputPath: '/data/test - templates-nometa.md',
  },


  {
    name: 'only renders content with a template with just the content block',
    options: {
      enexSource: './test/data/test-template 2.enex',
      outputDir: 'out',
      templateFile: './test/data/bare_template.templ',
      isMetadataNeeded: true,
      outputFormat: OutputFormat.ObsidianMD,
      skipEnexFileNameFromOutputPath: false,

    },
    testOutputPath: 'notes/test-template 2/test - templates just content.md',
    expectedOutputPath: '/data/test - templates just content.md',

  },



  {
    name: 'monospace code blocks',
    options: {
      enexSource: './test/data/test-monospace-codeblocks.enex',
      outputDir: 'out',
      templateFile: './test/data/bare_template.templ',
      isMetadataNeeded: true,
      outputFormat: OutputFormat.ObsidianMD,
      skipEnexFileNameFromOutputPath: false,
      monospaceIsCodeBlock: true,

    },

    testOutputPath: 'notes/test-monospace-codeblocks/test-monospace-codeblocks.md',
    expectedOutputPath: '/data/test-monospace-codeblocks.md',

  },



  {
    name: 'keep Markdown characters - noop escape function in turndown',
    options: {
      enexSource: './test/data/test-markdown-en.enex',
      outputDir: 'out',
      templateFile: './test/data/bare_template.templ',
      isMetadataNeeded: true,
      outputFormat: OutputFormat.ObsidianMD,
      skipEnexFileNameFromOutputPath: false,
      keepMDCharactersOfENNotes: true,

    },
    testOutputPath: 'notes/test-markdown-en/test-markdown-en.md',
    expectedOutputPath: '/data/test-markdown-en.md',

  },
  {
    name: ' Pure external url with unescapeable characters',
    options: {
      enexSource: './test/data/test-externalLink-escape.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      skipLocation: true,
      keepMDCharactersOfENNotes: true,
    },
    testOutputPath: 'notes/test-externalLink-escape/External Link.md',

    expectedOutputPath: '/data/test-externalLink-escape.md',
  },

  {
    name: ' Custom date format',
    options: {
      enexSource: './test/data/test-justTextButCustomDate.enex',
      outputDir: 'out',
      isMetadataNeeded: true,
      skipLocation: true,
      keepMDCharactersOfENNotes: true,
      dateFormat: 'YYYY MMMM DD',
    },
    testOutputPath: 'notes/test-justTextButCustomDate/test -note with text only.md',
    expectedOutputPath: '/data/test-justTextButCustomDate.md',
  },
  {
    name: 'multiple metadata content',
    options: {
      enexSource: './test/data/test-noteWithTags.enex',
      outputDir: 'out',
      templateFile: './test/data/multimeta-template.tmpl',
      isMetadataNeeded: true,
      outputFormat: OutputFormat.ObsidianMD,
      skipEnexFileNameFromOutputPath: false,
      keepMDCharactersOfENNotes: true,

    },
    testOutputPath: 'notes/test-noteWithTags/test -note with text only.md',
    expectedOutputPath: '/data/test-noteWithTags-multi.md',

  },

  {
    name: 'hanging enex',
    options: {
      enexSource: './test/data/huge-html.enex',
      outputDir: 'out',
      templateFile: './test/data/multimeta-template.tmpl',
      isMetadataNeeded: true,
      outputFormat: OutputFormat.ObsidianMD,
      skipEnexFileNameFromOutputPath: false,
      keepMDCharactersOfENNotes: true,

    },
    testOutputPath: 'notes/huge-html/Untitled Note.md',
    expectedOutputPath: '/data/test-hugeHtml.md',


  },
]