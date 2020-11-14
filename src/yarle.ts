// tslint:disable:no-console
import fs from 'fs';
import XmlStream from 'xml-stream';

import * as utils from './utils';
import { YarleOptions } from './YarleOptions';
import { processNode } from './process-node';
import { isWebClip } from './utils/note-utils';

export const defaultYarleOptions: YarleOptions = {
  enexFile: 'notebook.enex',
  outputDir: './mdNotes',
  isMetadataNeeded: false,
  isNotebookNameNeeded: false,
  isZettelkastenNeeded: false,
  plainTextNotesOnly: false,
  skipWebClips: false,
};

export let yarleOptions: YarleOptions = { ...defaultYarleOptions };

const setOptions = (options: YarleOptions): void => {
  yarleOptions = { ...defaultYarleOptions, ...options };
};

export const parseStream = async (options: YarleOptions): Promise<void> => {
  const stream = fs.createReadStream(options.enexFile);
  const xml = new XmlStream(stream);
  let noteNumber = 0;
  let failed = 0;
  let skipped = 0;
  
  const notebookName = utils.getNotebookName(options.enexFile);

  return new Promise((resolve, reject) => {
    const logAndReject = (error: Error) => {
      console.log(`Could not convert ${options.enexFile}:\n${error.message}`);
      ++failed;

      return reject();
    };

    xml.collect('tag');
    xml.collect('resource');

    xml.on('endElement: note', (note: any) => {
      if (options.skipWebClips && isWebClip(note)) {
          ++skipped;
          console.log(`Notes skipped: ${skipped}`);
      } else {
        processNode(note, notebookName);
        ++noteNumber;
        console.log(`Notes processed: ${noteNumber}`);
      }
    });

    xml.on('end', () => {
      const success = noteNumber - failed;
      const totalNotes = noteNumber + skipped;
      console.log(
        `Conversion finished: ${success} succeeded, ${skipped} skipped, ${failed} failed. Total notes: ${totalNotes}`,
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
