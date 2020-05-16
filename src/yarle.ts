
import * as fs from 'fs';
import * as parser from 'fast-xml-parser';
import * as moment from 'moment';
import * as TurndownService from 'turndown';
import { mkdirsSync } from 'fs-extra';

import { xmlParserOptions } from './xml-parser.options';
import * as utils from './utils';
import { Options } from './options';

export let yarleOptions: Options = {
  enexFile: 'notebook.enex',
  outputDir: './mdNotes',
  isMetadataNeeded: false,
  isZettelkastenNeeded: false,
};

const turndownService = new TurndownService({
    br: '',
    blankReplacement: (content, node: any) => {
      return node.isBlock ? '\n\n' : '';
    },
    keepReplacement: (content, node: any) => {
      return node.isBlock ? `\n${node.outerHTML}\n` : node.outerHTML;
    },
    defaultReplacement: (content, node: any) => {
      return node.isBlock ? `\n${content}\n` : content;
    },
  });

const resourceHashes: any = {};

const setOptions = (options: Options): void => {
  yarleOptions = options;
};

export const dropTheRope = (options: Options): void => {
  setOptions(options);
  utils.setPaths();
  const content = fs.readFileSync(options.enexFile, 'utf8');
  const notebook = parser.parse(content, xmlParserOptions);
  const notes = notebook['en-export'];
  utils.clearResourceDistDir();

  if (notes)
    if (Array.isArray(notes['note']))
      for (const note of notes['note'])
        processNode(note);
    else processNode(notes['note']);
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
      const replace = `<en-media [^>]*hash="${hash}".[^>]*\/>`;
      const re = new RegExp(replace, 'g');
      content = content.replace(re, `<img alt=${resourceHashes[hash]} src=./_resources/${relativeResourceWorkDir}/${resourceHashes[hash].replace(/ /g, '\ ')}>`);
    }
  } else
    data = data.concat(utils.getTitle(utils.paths.simpleMdPath, note));

  const markdown = turndownService.turndown(content);
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

const processResource = (workDir: string, resource: any): void => {
    const data = resource['data'];
    const timeStamp = resource['resource-attributes']['timestamp'];
    const fileName = resource['resource-attributes']['file-name'];
    const absFilePath = `${workDir}/${fileName}`;
    // tslint:disable-next-line: curly
    if (resource['recognition'] && resource['recognition']['__cdata'] && fileName) {
      const hashIndex = resource['recognition']['__cdata'].match(/[a-f0-9]{32}/);
      resourceHashes[hashIndex as any] = fileName;

    }
    const accessTime = moment(timeStamp);
    fs.writeFileSync(absFilePath, data, 'base64');
    const atime = accessTime.valueOf() / 1000;
    fs.utimesSync(absFilePath, atime, atime);
  };
