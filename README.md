
![logo](screens/yarle-logo.png)

# yarle: Yet Another Rope Ladder from Evernote

A tool that converts enex note(s) into Markdown format in order to let you escape from Evernote universe with all your belongings.

## Features:

- Works with enex files that contain single or multiple notes also.
- Works with notes that contain pictures too.
- Puts `title`, `creation time`, `update time`, `tags`, and `latlong` meta-information into md as metadata.
- Updates md files' access and modification timestamps according to the notes' update time.
- Organizes all attachments into a _resources subfolder (to keep the notes' folder as simple as possible).

## Restrictions: 

- Notes of Web Clips are not supported (yet).

## Installation

 0. [Install Node.js](https://nodejs.org/en/download/).
  
 1. Clone or download this repo.
 2. Open a terminal and navigate to the root folder of the repo.
 3. Type `npm i`, it installs the dependencies.
 4. Type `npm run build` to build the package.
 
## Usage:

Those markdown notes that contains external resources such pictures or files, are stored in `/<outputDir>/complexNotes` subfolder, the simple plain-text ones go to `/<outputDir>/simpleNotes` folder.

## Options:

 - ```--enexSource=<your-enex-file> or the folder of your enex files``` , specifies the exported Evernote notebook(s)
 - ```--outputDir=<relative_output_dir>``` , this is the main output dir in where the extracted markdown files are going to be created
 - ```--include-metadata``` , if it's set, then every markdown file will be extended by metadata (tags, time of creation, time of last update, lat-lon coordinates) 
 - ```--zettelkasten``` , puts Zettelkasten Id (based on time of creation) at the beginning of the file name
 - ```--plaintext-notes-only``` , skips those notes, which has attachment, or picture in it.
 - ```--skip-latlng```, does not include location into metadata section
 - ```--skip-creation-time```, does not include creation time into metadata section
 - ```--skip-update-time```, does not include update time into metadata section
 - ```--skip-tags``` , does not include tags into metadata section
 - ```--outputFormat```, generates internal file links and highlights in Obsidian-style: highlights are going to be bounded by `==` instead of \` characters, file links are going to be as follows: `![[file-name]]` instead of `![file-name](file-name)`. Possible values: `ObsidianMD` to get Obsidian-style notes, `StandardMD` or skip it completely, if you prefere Standard Markdown format. 
       

### Using cmd: 
```shell
  npm run start -- --enexSource=GeneralNotes.enex --outputDir=./out --include-metadata --zettelkasten --plaintext-notes-only --outputFormat=ObsidianMD
```

### In program: 

```javascript
 const options: YarleOptions = {
        enexFile: 'enexFile',
        outputDir: 'outputDir',
        isZettelkastenNeeded: true,
        isMetadataNeeded: false ,
    };
 yarle.dropTheRope(options);
```

## Release notes

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
