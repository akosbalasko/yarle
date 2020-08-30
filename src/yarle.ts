import * as fs from 'fs';
import * as parser from 'fast-xml-parser';
import * as XmlStream from 'xml-stream';
import * as flow from 'xml-flow';

import { xmlParserOptions } from './xml-parser.options';
import * as utils from './utils';
import { YarleOptions } from './YarleOptions';
import { processNode } from './process-node';

export let yarleOptions: YarleOptions = {
  enexFile: 'notebook.enex',
  outputDir: './mdNotes',
  isMetadataNeeded: false,
  isZettelkastenNeeded: false,
  plainTextNotesOnly: false,
};

const setOptions = (options: YarleOptions): void => {
  yarleOptions = { ...yarleOptions, ...options };
};

export const parseStream = async (options: YarleOptions): Promise<void> => {
  const stream = fs.createReadStream(options.enexFile);
  const xml = new XmlStream(stream);
  let noteNumber = 0;
  const xmlStream = flow(stream);

  return new Promise((resolve, reject) => {
    xmlStream.on('tag:note', (note: any) => {
      processNode(note);
      ++noteNumber;
      console.log(`Notes converted: ${noteNumber}`);
    });
    xmlStream.on('end', () => {
      console.log('Conversion finished');
      return resolve();
    });
    xmlStream.on('error', () => {
      return reject();
    });
    stream.on('error', reject); // enoent errors happen on the file stream not the xml stream

    /* xml.preserve('en-export', true);
    xml.collect('note');
    xml.on('endElement: note', (item: any) => {
      let np = new NodeProcessor();
      np.processNode(item);
      np = undefined;
      
     console.log('note');
    });*/
  });
};

export const dropTheRope = async (options: YarleOptions): Promise<void> => {
  setOptions(options);
  utils.setPaths();
  /* const content = fs.readFileSync(options.enexFile, 'utf8');
  const notebook = parser.parse(content, xmlParserOptions);
  const notes = notebook['en-export'];*/
  return parseStream(options);
  /*
    const notes = notebook['en-export'];
    // utils.clearResourceDistDir();
  
    if (notes) {
      if (Array.isArray(notes['note'])) {
        for (const [index, note] of notes['note'].entries()) {
          if (!(yarleOptions.plainTextNotesOnly && note.resource)) {
            processNode(note);
          }
        }
      } else if (!(yarleOptions.plainTextNotesOnly && notes['note'] as any).resource) {
          processNode(notes['note']);
      }
    }*/
};
