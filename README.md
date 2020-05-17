

# yarle: Yet Another Rope Ladder from Evernote

A tool that converts enex note(s) into Markdown format in order to let you escape from Evernote universe with all your belongings.

## Features:

- Works with enex files that contain single or multiple notes also.
- Works with notes that contain pictures too.
- Puts `title`, `creation time`, `update time`, `tags`, and `latlong` meta-information into md as metadata.
- Updates md files' access and modification timestamps according to the notes' update time.
- Organizes all attachments into a _resources subfolder (to keep the notes' folder as simple as possible).

## Installation

 - install Node.js (![details here](https://nodejs.org/en/download/))
 - clone or download this repo
 - npm i
 
## Usage:

Those markdown notes that contains external resources such pictures or files, are stored in `/<outputDir>/complexNotes` subfolder, the simple plain-text ones go to `/<outputDir>/simpleNotes` folder.

## Options:

 - --enexFile=<your-enex-file> , specifies the exported Evernote notebook
 - --outputDir=<relative_output_dir> , this is the main output dir in where the extracted markdown files are going to be created
 - --include-metadata , if its set, then every markdown file will be extended by metadata (tags, time of creation, time of last update, lat-lon coordinates) 
 - --zettelkasten , puts Zettelkasten Id (based on time of creation) at the beginning of the file name
  --plaintext-notes-only, skips those notes, which has attachment, or picture in it.

### Using cmd: 
```shell
  npm run start -- --enexFile=GeneralNotes.enex --outputDir=./out --include-metadata --zettelkasten --plaintext-notes-only
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

### Version 2.0.3

 - plaintext-notes-only command line argument added, that enables you to skip converting notes with any resources, pictures, pdf, etc.

### Version 2.0: 

 - The whole tool is reimplemented in Typescript
 - ZettelKasten ID is an option for filename generation (format is <id>|(pipe) <title>.md or <id>.md if there is no title)

### version 1.2.0, fixes and improvements:

- File name conventions changed (whitespaces are generated instead of underscores)
- Metadata is moved at the end of the text and transformed as code snippet (looks better in Ulysses)
- Fix on HTML to MD conversion (turndown package is configured better to do not add multiple newline characters )
