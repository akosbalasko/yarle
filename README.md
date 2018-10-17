

# yarle: Yet Another Rope Ladder from Evernote

A tool that converts enex note(s) into Markdown format in order to let you escape from Evernote universe with all your belongings.

## Features:

- Works with enex files that contain single or multiple notes also.
- Works with notes that contain pictures too.
- Puts `title`, `creation time`, `update time`, `tags`, and `latlong` meta-information into md as metadata.
- Updates md files' access and modification timestamps according to the notes' update time.
- Organizes all attachments into a _resources subfolder (to keep the notes' folder as simple as possible).

## Usage:

Those markdown notes that contains external resources such pictures or files, are stored in `/out/complexNotes` subfolder, while in case of simple, plain-text notes go to `/out/simpleNotes` folder.

### Using cmd: 
```shell
  node ./dropTheRope.js <your_enex_filepath>
```

### In program: 

```javascript
 yarle.dropTheRope(<your_enex_filepath>);
```
### Release notes
#### version 1.3.0, fixes and improvements:

- File name conventions changed (whitespaces used instead of underscores)
- Metadata is moved at the end of the text and transformed as code snippet (looks better in Ulysses)
- Fix on HTML to MD conversion (turndown package is configured better to do not add multiple newline characters )