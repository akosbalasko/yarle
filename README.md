
![logo](screens/yarle-logo.png)

# yarle: Yet Another Rope Ladder from Evernote

A tool that converts enex note(s) into Markdown format in order to let you escape from Evernote universe with all your belongings.

## Features:

- Works with enex files that contain single or multiple notes also.
- Works with notes that contain pictures too.
- Puts `title`, `creation time`, `update time`, `tags`, and `latlong` meta-information into md as metadata.
- Updates md files' access and modification timestamps according to the notes' update time.
- Organizes all attachments into a _resources subfolder (to keep the notes' folder as simple as possible).
- Creates Markdown files matching to user-defined templates, see Templates introduced. See [How to use templates with YARLE](Templates.md) for details.

## Prerequisite

 - Required [Install Node.js](https://nodejs.org/en/download/) version 10.22.1 or higher.

## Installation
 
 You can install yarle using npm as follows: 
  ```bash
   npm i -g  yarle-evernote-to-md
  ```
Or you can use yarle without install anything (See npx command in [Usage](#Usage)).

## Configuration:

To configure Yarle, you must create a config file. By default it looks like this:

```
{
    "enexSource": "/../test/data/test-template.enex",
    "templateFile": "/sampleTemplate.tmpl",
    "outputDir": "out",
    "isMetadataNeeded": false,
    "isNotebookNameNeeded": false,
    "isZettelkastenNeeded": false,
    "plainTextNotesOnly": false,
    "skipLocation": false,
    "skipCreationTime": false,
    "skipUpdateTime": false,
    "skipWebClips": false,
    "skipTags": false,
    "outputFormat": "StandardMD",
    "skipEnexFileNameFromOutputPath": false
}
```
The following configurational properties are available: 
|
|Property Name| Property value | Meaning |
|-------------|----------------|---------|
|```enexSource```| your enex file or the folder of your enex files | specifies the exported Evernote notebook(s) relatively to the dist folder, starting with a folder-separator (/ in Linux or Mac, \\ in Windows)|
|```templateFile``` | path to your custom template file relatively to the root folder of Yarle | if its not specified, a [default template](https://github.com/akosbalasko/yarle/blob/master/src/utils/templates/default-template.ts) will be used
|```outputDir``` | relative path to your output dir | this is the main output dir where the extracted markdown files and the external resources, images, pdf-s are going to be created|
|```include-metadata```| true or false | if it's set to true, then every Markdown file will be supplemented with metadata (tags, time of creation, time of last update, lat-lon coordinates) |
|```include-notebook-name```|  true or false | if set, every Markdown file will include the .enex file name in the metadata section. This is useful if you export each notebook as a separate enex file and wish to have them organized in ObsidianMD (or similar). Requires '--include-metadata' to be set.|
|```zettelkasten``` |  true or false | puts Zettelkasten Id (based on time of creation) at the beginning of the file name|
|```plaintext-notes-only``` |  true or false | skips any notes with attachments (e.g. notes containing pictures)|
|```skip-latlng```|  true or false | does not include location in metadata section|
|```skip-creation-time```|  true or false | does not include creation time in metadata section|
|```skip-update-time```|  true or false | does not include update time in metadata section|
|```skip-tags```|  true or false | does not include tags in metadata section|
|```outputFormat```|  true or false | generates internal file links and highlights in Obsidian-style: highlights are going to be bounded by `==` instead of \` characters, file links are going to be as follows: `![[file-name]]` instead of `![file-name](file-name)`. Possible values: `ObsidianMD` to get Obsidian-style notes, `StandardMD` or skip it completely, if you prefer Standard Markdown format.|
       
## Usage 

### Using cmd:

After setting up your config file, and optionally your template file, just type 
```javascript
yarle --configFile <path_to_your_file e.g. ./config.json>
```
or without installation with npx: 
```javascript
npx -p  yarle-evernote-to-md yarle  --configFile <path_to_your_file e.g. ./config.json>
```


### In program: 

```javascript
 const options: YarleOptions = {
        enexSource: 'enexFile',
        outputDir: 'outputDir',
        isZettelkastenNeeded: true,
        isMetadataNeeded: false ,
    };
 yarle.dropTheRope(options);
```

## Release notes

### Version 3.1.0

- Changelog:
   1. Installation and configuration simplified.

### Version 3.0.0

- Changelog:
   1. Templates introduced. See section [How to use templates with YARLE](Templates.md)
   2. Configuration is read from file instead of command line arguments, see [Configuration](#Configuration) for details.
   3. Easier usage, yarle as a command, see [Usage](#Usage) for details.
   5. Name of notebook is added as configuratble metadata option to be embedded into the note
   6. Inclusion of web-clips is a configurable option 

- No more broken:
   1.  Mayor set of fixes around internal links, check [this umbrella-issue](https://github.com/akosbalasko/yarle/issues/92) about the changes.
   2. Codeblock issue


### Version 2.11.0

- Features: 
   1. Webclipped notes, namely articles, simplified articles, bookmarks, screenshots scraped by Evernote's web clipper are converted
   2. UrlEncodeMD introduced as possible value of 'outputFormat' property, it makes image links be url-encoded in markdown notes, thx to [Martin Hähnel](https://github.com/finn-matti)
   3. Links in headers supported

- Fixes: 
   1. [Memory leak issue](https://github.com/akosbalasko/yarle/issues/55)
   2. [List items indented correctly](https://github.com/akosbalasko/yarle/issues/60), thx to [Martin Hähnel](https://github.com/finn-matti)
   3. [Bug of multiple links point to the same resource fixed](https://github.com/akosbalasko/yarle/issues/56)
   4. [Required node version clarification](https://github.com/akosbalasko/yarle/pull/59), thx to [Mesc](https://github.com/mescalito)
 

### Version 2.9.2 

- [Issue#49](https://github.com/akosbalasko/yarle/issues/49) fixed
- [Issue#53](https://github.com/akosbalasko/yarle/issues/53) fixed

### Version 2.9.1

- Enclosing brackets around links are removed to avoid causing troubles in MD file (fixes: [Issue#50](https://github.com/akosbalasko/yarle/issues/50)) 

### Version 2.9.0

- NodeJs version limitation resolved.
- Feature requested in [Issue#39](https://github.com/akosbalasko/yarle/issues/39) implemented: the conversion returns the number of the failed notes if any.
- Logo added to readme.
- Previously if unit tests were executed in timezone differs from Western Europe, they were failed. It's fixed now.
- Bug reported in [Issue#39](https://github.com/akosbalasko/yarle/issues/39) fixed.
- Action added to test Yarle in different Node versions.

Special thanks to [Rodrigo Vieira](https://github.com/rodbv) for the contribution!  

### Version 2.8.0

- New command-line argument introduced : `--outputFormat`.  Its optional, one possible value is `ObsidianMD` that configures Yarle to generate internal file links and highlights in Obsidian-style. 

### Version 2.7.0

 - Huge performance improvement, works with enex files that contain 2k+ notes
 - Bugfix: generates OS-friendly file and folder names 

### Version 2.6.6

 - Logging improved
 - Bug around tag extraction fixed

### Version 2.6.5

 - Bugfix: handling internal resource files (with no filenames) correctly 
  
### Version 2.6.4

 - Small bugfixes 

### Version 2.6.1

 - Attached images are converted as standard Markdown images instead of as wikistyle-links. 

### Version 2.6.0

 - Highlights supported
 - Typescript building bugfix

### Version 2.5.0

 - Generating links in wiki-style links is supported by default, its command line argument is removed.
 - Evernote's internal links among the notes are supported in the case if the **note title** and **its created reference** is the same text.  

### Version 2.4.1

As a hotfix notes within resources (e.g. web clips) are skipped to be referenced from the generated Markdown files. 


### Version 2.4.0

 - Folders can be added as input, in this case all the enex files within this folder will be transformed 
 - Zettelkasten IDs are unique, if multiple notes has been created in the same minute, then they will be indexed by numbers starting from 1 (except the first, it has no index)
 
### Version 2.3.2

 - Bugfix: untitled notes' title is removed from the generated filename if Zettelkasten is required.
 - Bugfix: tags are moved to the top and # added as prefix for each if it's missing. 


### Version 2.3.0

 - Skipping parts of metadata in configurable via options
  
### Version 2.2.0

 - Links are generated in wiki-style links ([[link]]) if `--wikistyle-media-links` option is set
 - Bugfix: Notes with single resources are exported fine 
 - Codebase refactored


### Version 2.1.1

 - Conversion of tables, lists, numbered lists and checkboxes are supported.

### Version 2.0.4

 - plaintext-notes-only command line argument added, that enables you to skip converting notes with any resources, pictures, pdf, etc.

### Version 2.0.1: 

 - The whole tool is reimplemented in Typescript
 - ZettelKasten ID is an option for filename generation (format is <id>|(pipe) <title>.md or <id>.md if there is no title)

### version 1.2.0, fixes and improvements:

- File name conventions changed (whitespaces are generated instead of underscores)
- Metadata is moved at the end of the text and transformed as code snippet (looks better in Ulysses)
- Fix on HTML to MD conversion (turndown package is configured better to do not add multiple newline characters )
