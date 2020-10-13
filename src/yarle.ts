// tslint:disable:no-console
import * as fs from 'fs';
import * as XmlStream from 'xml-stream';

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
  let failed = 0;
  let totalNotes = 0;

  return new Promise((resolve, reject) => {
    const logAndReject = (error: Error) => {
      console.log(`Could not convert ${options.enexFile}:\n${error.message}`);
      ++failed;

      return reject();
    };
  
    xml.collect('tag');
    xml.collect('resource');
    xml.on('startElement: en-export', (enExport: any) => {
      totalNotes = Array.isArray(enExport.note) ? enExport.note.length : 1;
    });

    xml.on('endElement: note', (note: any) => {
      
      processNode(note);
      ++noteNumber;
      console.log(`Notes processed: ${noteNumber}`);
    });

    xml.on('end', () => {
      const success = noteNumber - failed;
      console.log(
        `Conversion finished: ${success} succeeded, ${
          totalNotes - success
        } failed.`,
      );

      return resolve();
    });
    xml.on('error', logAndReject);
    stream.on('error', logAndReject);
  });
};

export const dropTheRope = async (options: YarleOptions): Promise<void> => {
  setOptions(options);
  utils.setPaths();

  return parseStream(options);

};
// tslint:enable:no-console
