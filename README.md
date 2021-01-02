
![logo](screens/yarle-logo.png)

Yarle is the ultimate converter of Evernote notes to Markdown.

## Features:

### Yarle can convert:
- :memo: Any text
- :link: External links
- :link: Internal links among Evernote notes
- :computer: Codeblocks
- :framed_picture: Inline Images
- :paperclip: Attachments
- :page_facing_up: Webclips

### Works with: 
- :notebook: single enex file (one notebook exported from Evernote)
- :books: or a folder of enex files supported (several notebooks exported and placed into the same folder locally)

### Highly customizable: 

- :bulb: Metadata support: Puts `title`, `creation time`, `update time`, `tags`, and `latlong` `source` meta-information into md as metadata.
- :rocket: Creates Markdown files matching to user-defined templates, see Templates introduced. See [How to use templates with YARLE](Templates.md) for details.
- :hammer: Updates md files' creation, access, and modification timestamps according to the notes' original create/update/modification time.
- :hammer: Organizes all attachments into a _resources subfolder (to keep the notes' folder as simple as possible).

## Prerequisite

 - Required [Install Node.js](https://nodejs.org/en/download/) version 10.22.1 or higher.

## No-install execution
Just open a terminal, specify config options in a config file (options detailed in [Configuration](#Configuration)) and type the following:

```javascript
npx -p yarle-evernote-to-md@latest yarle --configFile <path_to_your_file e.g. ./config.json>
```

## Configuration:

To configure Yarle, you must create a config file. By default it looks like this:

```
{
    "enexSource": "/absolute-path-of-your-enex-dir/test-template.enex",
    "templateFile": "/absolute-path-of-your-template-dir/sampleTemplate.tmpl",
    "outputDir": "out",
    "keepOriginalHtml": false,
    "isMetadataNeeded": false,
    "isNotebookNameNeeded": false,
    "isZettelkastenNeeded": false,
    "plainTextNotesOnly": false,
    "skipLocation": false,
    "skipCreationTime": false,
    "skipUpdateTime": false,
    "skipSourceUrl": false,
    "skipWebClips": false,
    "skipTags": false,
    "useHashTags": true,
    "outputFormat": "StandardMD",
    "skipEnexFileNameFromOutputPath": false,
    "monospaceIsCodeBlock": false,
    "keepMDCharactersOfENNotes": false,
    "nestedTags": {
      "separatorInEN": "_",
      "replaceSeparatorWith": "/",
      "replaceSpaceWith": "-"
   }
}
```
The following configurational properties are available:
|
|Property Name| Property value | Meaning |
|-------------|----------------|---------|
|```enexSource```| your enex file or the folder of your enex files | specifies the exported Evernote notebook(s) as an absolute path|
|```templateFile``` | absolute path of your custom template file | if its not specified, a [default template](https://github.com/akosbalasko/yarle/blob/master/src/utils/templates/default-template.ts) will be used
|```outputDir``` | relative path to your output dir | this is the main output dir where the extracted markdown files and the external resources, images, pdf-s are going to be created|
|```keepOriginalHtml```| true or false | if set to true, then an additional HTML page that is an exact copy of the original note will be created in the `_resources` folder|
|```isMetadataNeeded```| true or false | if it's set to true, then every Markdown file will be supplemented with metadata (tags, time of creation, time of last update, lat-lon coordinates) |
|```isNotebookNameNeeded```|  true or false | if set, every Markdown file will include the .enex file name in the metadata section. This is useful if you export each notebook as a separate enex file and wish to have them organized in ObsidianMD (or similar). Requires '--include-metadata' to be set.|
|```isZettelkastenNeeded``` |  true or false | puts Zettelkasten Id (based on time of creation) at the beginning of the file name|
|```plaintextNotesOnly``` |  true or false | skips any notes with attachments (e.g. notes containing pictures)|
|```skipLocation```|  true or false | does not include location in metadata section|
|```skipCreationTime```|  true or false | does not include creation time in metadata section|
|```skipUpdateTime```|  true or false | does not include update time in metadata section|
|```skipSourceUrl```|  true or false | does not include the source url in metadata section|
|```skipTags```|  true or false | does not include tags in metadata section|
|```useHashTags```|  true or false | whether to add the pound sign in front of tags|
|```outputFormat```|  true or false | generates internal file links and highlights in Obsidian-style: highlights are going to be bounded by `==` instead of \` characters, file links are going to be as follows: `![[file-name]]` instead of `![file-name](file-name)`. Possible values: `ObsidianMD` to get Obsidian-style notes, `StandardMD` or skip it completely, if you prefer Standard Markdown format.|
|```monospaceIsCodeBlock```| true or false | if it's true then all deepest elements with monospace font style is recognized as Codeblocks|       
|```keepMDCharactersOfENNotes```| true or false | set it true, if you used Markdown format in your EN notes|
| ``` nestedTags``` | it's a complex property contains the following subitems: "separatorInEN", "replaceSeparatorWith" and  "replaceSpaceWith" | separatorInEN stores the tag separator used in Evernote, replaceSeparatorWith is the string to what separatorInEN should be replaced to, and replaceSpaceWith is the string to what the space character should be replaced to in the tags. For example using the default settings a tag ```tag1_sub tag of tag1``` is going to be converted to ```tag1/sub-tag-of-tag1``` 
       

## [Release notes](https://github.com/akosbalasko/yarle/wiki/Release-notes)
