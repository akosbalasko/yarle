
import * as fs from 'fs';
import * as parser from 'fast-xml-parser';
import * as moment from 'moment';
import * as TurndownService from 'turndown';

import { xmlParserOptions } from './xml-parser.options';
import * as utils from './utils';

/*
export let options = {
  'no-metadata': false,
};*/

// simpleNotes folder will contain those notes that contains plain text only
const simpleMdPath = `${__dirname}/../out/simpleNotes`;
// complexNotes folder contains notes that have external resources (eg. images, pdf etc.)
const complexMdPath = `${__dirname}/../out/complexNotes`;
const resourcePath = `${complexMdPath}/_resources`;

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
utils.clearDistDir(simpleMdPath);
utils.clearDistDir(complexMdPath);

export const dropTheRope = (enexFile: any): void => {

  const content = fs.readFileSync(enexFile, 'utf8');
  const notebook = parser.parse(content, xmlParserOptions);
  const notes = notebook['en-export'];
  utils.clearDistDir(resourcePath);

  if (notes)
    if (Array.isArray(notes['note']))
      for (const note of notes['note'])
        processNode(note);
    else processNode(notes['note']);
};

const processNode = (note: any): void => {
  let data = '';
  let content = note['content']['__cdata'];
  let absFilePath = utils.getFilePath(simpleMdPath, note);
  if (note['resource']) {
    absFilePath = utils.getFilePath(complexMdPath, note);
    data = data.concat(utils.getTitle(complexMdPath, note));

    const relativeWorkDir = `${utils.getResourceDir(complexMdPath, note)}.resources`;
    const absoluteWorkDir = `${resourcePath}/${relativeWorkDir}`;

    utils.clearDistDir(absoluteWorkDir);
    if (Array.isArray(note['resource']))
      for (const resource of note['resource'])
        processResource(absoluteWorkDir, resource);
    else {
      utils.clearDistDir(absoluteWorkDir);
      processResource(absoluteWorkDir, note['resource']);
    }

    for (const hash of resourceHashes) {
      const replace = `<en-media [^>]*hash="${hash}".[^>]*\/>`;
      const re = new RegExp(replace, 'g');
      content = content.replace(re, `<img alt=${resourceHashes[hash]} src=./_resources/${relativeWorkDir}/${resourceHashes[hash].replace(/ /g, '\ ')}>`);
    }
  } else
    data = data.concat(utils.getTitle(simpleMdPath, note));

  const markdown = turndownService.turndown(content);
  data = data.concat(markdown);
  const metadata = utils.getMetadata(note);
  data = data.concat(metadata);

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
