import { cloneDeep } from 'lodash';
import fs from 'fs';
import md5File from 'md5-file';
import * as path from 'path';

import { ResourceHashItem } from './models/ResourceHash';
import * as utils from './utils';

import { yarleOptions } from './yarle';
import { loggerInfo } from './utils';

export const processResources = (note: any): string => {
    let resourceHashes: any = {};
    let updatedContent = cloneDeep(note.content);
    const pathSepRegExp = new RegExp(`\\${path.sep}`,'g');
    const relativeResourceWorkDir = utils.getRelativeResourceDir(note).replace(pathSepRegExp,yarleOptions.pathSeparator);
    const absoluteResourceWorkDir = utils.getAbsoluteResourceDir(note) // .replace(pathSepRegExp,yarleOptions.pathSeparator);

    loggerInfo(`relative resource work dir: ${relativeResourceWorkDir}`);

    loggerInfo(`absolute resource work dir: ${absoluteResourceWorkDir}`);

    utils.clearResourceDir(note);
    if (Array.isArray(note.resource)) {
      for (const resource of note.resource) {
        resourceHashes = {
          ...resourceHashes,
          ...processResource(absoluteResourceWorkDir, resource)};
      }
    } else {
      resourceHashes = {
        ...resourceHashes,
        ...processResource(absoluteResourceWorkDir, note.resource)};
    }

    for (const hash of Object.keys(resourceHashes)) {
      updatedContent = addMediaReference(updatedContent, resourceHashes, hash, relativeResourceWorkDir);
    }

    return updatedContent;
  };

const addMediaReference = (content: string, resourceHashes: any, hash: any, workDir: string): string => {
  const src = `${workDir}${yarleOptions.pathSeparator}${resourceHashes[hash].fileName.replace(/ /g, '\ ')}`;
  loggerInfo(`mediaReference src ${src} added`);
  let updatedContent = cloneDeep(content);
  const replace = `<en-media ([^>]*)hash="${hash}".([^>]*)>`;
  const re = new RegExp(replace, 'g');
  const matchedElements = content.match(re);

  const mediaType = matchedElements && matchedElements.length > 0 && matchedElements[0].split('type=');
  if (mediaType && mediaType.length > 1 && mediaType[1].startsWith('"image')) {
    const width = matchedElements[0].match(/width="(\w+)"/);
    const widthParam = width ? ` width="${width[1]}"` : '';

    const height = matchedElements[0].match(/height="(\w+)"/);
    const heightParam = height ? ` height="${height[1]}"` : '';

    updatedContent = content.replace(re, `<img src="${src}"${widthParam}${heightParam} alt="${resourceHashes[hash].fileName}">`);
  } else {
    updatedContent = content.replace(re, `<a href="${src}" type="file">${resourceHashes[hash].fileName}</a>`);
  }

  return updatedContent;
};

const processResource = (workDir: string, resource: any): any => {
    const resourceHash: any = {};
    const data = resource.data.$text;

    const resourceFileProps = utils.getResourceFileProperties(workDir, resource);
    const fileName = resourceFileProps.fileName;
    const absFilePath = `${workDir}${path.sep}${fileName}`;

    const accessTime = utils.getTimeStampMoment(resource);
    fs.writeFileSync(absFilePath, data, 'base64');

    const atime = accessTime.valueOf() / 1000;
    fs.utimesSync(absFilePath, atime, atime);

    if (resource.recognition && fileName) {
      const hashIndex = resource.recognition.match(/[a-f0-9]{32}/);
      loggerInfo(`resource ${fileName} addid in hash ${hashIndex}`);
      resourceHash[hashIndex as any] = {fileName, alreadyUsed: false} as ResourceHashItem;
    } else {
      const md5Hash = md5File.sync(absFilePath);
      resourceHash[md5Hash] = {fileName, alreadyUsed: false} as ResourceHashItem;
    }

    return resourceHash;
};
