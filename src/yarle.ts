// tslint:disable:no-console
import fs from 'fs';
const flow = require('xml-flow')
import * as utils from './utils';
import { YarleOptions } from './YarleOptions';
import { processNode } from './process-node';
import { isWebClip } from './utils/note-utils';
import { loggerInfo } from './utils/loggerInfo';
import { hasCreationTimeInTemplate, hasLocationInTemplate, hasSourceURLInTemplate, hasTagsInTemplate, hasUpdateTimeInTemplate, hasNotebookInTemplate, hasLinkToOriginalInTemplate } from './utils/templates/checker-functions';
import { defaultTemplate } from './utils/templates/default-template';
import { OutputFormat } from './output-format';

export const defaultYarleOptions: YarleOptions = {
  enexSource: 'notebook.enex',
  outputDir: './mdNotes',
  keepOriginalHtml: false,
  isMetadataNeeded: false,
  isNotebookNameNeeded: false,
  isZettelkastenNeeded: false,
  plainTextNotesOnly: false,
  skipWebClips: false,
  useHashTags: true,
  nestedTags: {
    separatorInEN: '_',
    replaceSeparatorWith: '/',
    replaceSpaceWith: '-'
  },
  outputFormat: OutputFormat.StandardMD,
  urlEncodeFileNamesAndLinks: false,
};

export let yarleOptions: YarleOptions = { ...defaultYarleOptions };

const setOptions = (options: YarleOptions): void => {
  yarleOptions = { ...defaultYarleOptions, ...options };


  let template = (yarleOptions.templateFile)  ?  fs.readFileSync(yarleOptions.templateFile, 'utf-8'): defaultTemplate;
  template = yarleOptions.currentTemplate ? yarleOptions.currentTemplate : template;

  /*if (yarleOptions.templateFile) {*/
  // todo: handle file not exists error
  yarleOptions.skipCreationTime = !hasCreationTimeInTemplate(template);
  yarleOptions.skipLocation = !hasLocationInTemplate(template);
  yarleOptions.skipSourceUrl = !hasSourceURLInTemplate(template);
  yarleOptions.skipTags = !hasTagsInTemplate(template);
  yarleOptions.skipUpdateTime = !hasUpdateTimeInTemplate(template);
  yarleOptions.isNotebookNameNeeded = hasNotebookInTemplate(template);
  yarleOptions.keepOriginalHtml = hasLinkToOriginalInTemplate(template);

  yarleOptions.currentTemplate = template;

  // loggerInfo(`Current config is: ${JSON.stringify(yarleOptions)}`);
  /*}*/
};

export const parseStream = async (options: YarleOptions): Promise<void> => {
  // loggerInfo(`Getting stream from ${options.enexSource}`);
  const stream = fs.createReadStream(options.enexSource);
  // const xml = new XmlStream(stream);
  let noteNumber = 0;
  let failed = 0;
  let skipped = 0;

  const notebookName = utils.getNotebookName(options.enexSource);

  return new Promise((resolve, reject) => {

    const logAndReject = (error: Error) => {
      loggerInfo(`Could not convert ${options.enexSource}:\n${error.message}`);
      ++failed;

      return reject();
    };
    if (!fs.existsSync(options.enexSource)) {
      return logAndReject({ name: 'NoSuchFileOrDirectory', message: 'source Enex file does not exists' });
    }

    const xml = flow(stream);

    let noteAttributes: any = null;
    xml.on('tag:note-attributes', (na: any) => {
      noteAttributes = na;
    });

    xml.on('tag:note', (note: any) => {
      if (options.skipWebClips && isWebClip(note)) {
        ++skipped;
        loggerInfo(`Notes skipped: ${skipped}`);
      } else {
        if (noteAttributes) {
          // make sure single attributes are not collapsed
          note['note-attributes'] = noteAttributes;
        }
        processNode(note, notebookName);
        ++noteNumber;
        loggerInfo(`Notes processed: ${noteNumber}\n\n`);
      }
      noteAttributes = null;
    });

    xml.on('end', () => {
      const success = noteNumber - failed;
      const totalNotes = noteNumber + skipped;
      loggerInfo("==========================");
      loggerInfo(
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
