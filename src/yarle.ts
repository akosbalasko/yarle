
import * as fs from 'fs';
import * as parser from 'fast-xml-parser';
import * as moment from 'moment';
import { cloneDeep } from 'lodash';

import { xmlParserOptions } from './xml-parser.options';
import * as utils from './utils';
import { YarleOptions  } from './YarleOptions';
import { getTurndownService } from './utils/TurndownService';

export let yarleOptions: YarleOptions  = {
  enexFile: 'notebook.enex',
  outputDir: './mdNotes',
  isMetadataNeeded: false,
  isZettelkastenNeeded: false,
  plainTextNotesOnly: false,
  wikiStyleMediaLinks: false,
};

const resourceHashes: any = {};

const setOptions = (options: YarleOptions): void => {
  yarleOptions = {...yarleOptions, ...options};
};

export const dropTheRope = (options: YarleOptions): void => {
  setOptions(options);
  utils.setPaths();
  const content = fs.readFileSync(options.enexFile, 'utf8');
  const notebook = parser.parse(content, xmlParserOptions);
  const notes = notebook['en-export'];
  utils.clearResourceDistDir();

  if (notes)
    if (Array.isArray(notes['note']))
      for (const note of notes['note']) {
        if (!(yarleOptions.plainTextNotesOnly && note['resource'])) {
          processNode(note);
        }
      }
    else
    if (!(yarleOptions.plainTextNotesOnly && notes['note'] as any)['resource'])
        processNode(notes['note']);

};

const processNode = (note: any): void => {
  let data = '';
  let content = note['content']['__cdata'];
  let absFilePath = utils.getSimpleFilePath(note);
  if (note['resource']) {
    absFilePath = utils.getComplexFilePath(note);
    data = data.concat(utils.getTitle(utils.paths.complexMdPath, note));

    const relativeResourceWorkDir = `${utils.getResourceDir(utils.paths.complexMdPath, note)}.resources`;
    const absoluteResourceWorkDir = `${utils.paths.resourcePath}/${relativeResourceWorkDir}`;

    utils.clearResourceDir(note);
    if (Array.isArray(note['resource']))
      for (const resource of note['resource'])
        processResource(absoluteResourceWorkDir, resource);
    else {
      utils.clearResourceDir(note);
      processResource(absoluteResourceWorkDir, note['resource']);
    }

    for (const hash of Object.keys(resourceHashes)) {
      content = addMediaReference(content, resourceHashes, hash, relativeResourceWorkDir);
    }
  } else
    data = data.concat(utils.getTitle(utils.paths.simpleMdPath, note));

  const markdown = getTurndownService().turndown(content);

  data = data.concat(markdown);
  if (yarleOptions.isMetadataNeeded) {
    const metadata = utils.getMetadata(note);
    data = data.concat(metadata);
  }
  try {
    fs.writeFileSync(absFilePath, data);
    utils.setFileDates(absFilePath, note);
  } catch (e) {
    // tslint:disable-next-line: no-console
    console.log('Cannot write file ', e);
    throw e;
  }

};
const addMediaReference = (content: string, resourceHashes: any, hash: any, relativeResourceWorkDir: string): string => {

  const src = `./_resources/${relativeResourceWorkDir}/${resourceHashes[hash].replace(/ /g, '\ ')}`;
  let updatedContent = cloneDeep(content);
  const replace = (hash === 'any') ?
    '<en-media [^>]*hash=".[^>]*\/>' :
    `<en-media [^>]*hash="${hash}".[^>]*\/>`;
  const re = new RegExp(replace, 'g');

  updatedContent = (!yarleOptions.wikiStyleMediaLinks) ?
    content.replace(re, `<img alt=${resourceHashes[hash]} src=${src}>`) :
    content.replace(re, `<a href=${src}>${resourceHashes[hash]}</a>`);

  return updatedContent;

};

const processResource = (workDir: string, resource: any): void => {
    const data = resource['data'];
    const timeStamp = resource['resource-attributes']['timestamp'];
    const fileName = resource['resource-attributes']['file-name'];
    const absFilePath = `${workDir}/${fileName}`;
    // tslint:disable-next-line: curly
    if (resource['recognition'] && resource['recognition']['__cdata'] && fileName) {
      const hashIndex = resource['recognition']['__cdata'].match(/[a-f0-9]{32}/);
      resourceHashes[hashIndex as any] = fileName;

    } else resourceHashes['any'] = fileName;

    const accessTime = moment(timeStamp);
    fs.writeFileSync(absFilePath, data, 'base64');
    const atime = accessTime.valueOf() / 1000;
    fs.utimesSync(absFilePath, atime, atime);
  };
