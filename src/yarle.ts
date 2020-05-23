
import * as fs from 'fs';
import * as parser from 'fast-xml-parser';

import { xmlParserOptions } from './xml-parser.options';
import * as utils from './utils';
import { YarleOptions  } from './YarleOptions';
import { processNode } from './process-node';

export let yarleOptions: YarleOptions  = {
  enexFile: 'notebook.enex',
  outputDir: './mdNotes',
  isMetadataNeeded: false,
  isZettelkastenNeeded: false,
  plainTextNotesOnly: false,
  wikiStyleMediaLinks: false,
};

const setOptions = (options: YarleOptions): void => {
  yarleOptions = {...yarleOptions, ...options};
};

export const dropTheRope = (options: YarleOptions): void => {
  setOptions(options);
  utils.setPaths();
  const content = fs.readFileSync(options.enexFile, 'utf8');
  const notebook = parser.parse(content, xmlParserOptions);
  const notes = notebook['en-export'];
  // utils.clearResourceDistDir();

  if (notes) {
    if (Array.isArray(notes['note'])) {
      for (const note of notes['note']) {
        if (!(yarleOptions.plainTextNotesOnly && note['resource'])) {
          processNode(note);
        }
      }
    } else if (!(yarleOptions.plainTextNotesOnly && notes['note'] as any)['resource']) {
        processNode(notes['note']);
    }
  }
};
