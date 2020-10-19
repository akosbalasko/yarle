import { cloneDeep } from 'lodash';
import * as fs from 'fs';
import { ResourceHashItem } from './models/ResourceHash';
import * as utils from './utils';
import * as md5File from 'md5-file';

export const processResources = (note: any, content: string): string => {
    let resourceHashes: any = {};
    let updatedContent = cloneDeep(content);

    const relativeResourceWorkDir = `${utils.getResourceDir(utils.paths.complexMdPath, note)}.resources`;
    const absoluteResourceWorkDir = `${utils.paths.resourcePath}/${relativeResourceWorkDir}`;

    utils.clearResourceDir(note);
    if (Array.isArray(note.resource)) {
      for (const resource of note.resource) {
        resourceHashes = {
          ...resourceHashes,
          ...processResource(absoluteResourceWorkDir, resource)};
      }
    } else {
      utils.clearResourceDir(note);
      resourceHashes = {
        ...resourceHashes,
        ...processResource(absoluteResourceWorkDir, note.resource)};
    }

    for (const hash of Object.keys(resourceHashes)) {
      updatedContent = addMediaReference(updatedContent, resourceHashes, hash, relativeResourceWorkDir);
    }

    return updatedContent;
  };

const addMediaReference = (content: string, resourceHashes: any, hash: any, relativeResourceWorkDir: string): string => {

  const src = `./_resources/${relativeResourceWorkDir}/${resourceHashes[hash].fileName.replace(/ /g, '\ ')}`;
  let updatedContent = cloneDeep(content);
  const replace =`<en-media ([^>]*)hash="${hash}".([^>]*)>`;
  const re = new RegExp(replace, 'g');
  const matchedElements = content.match(re);
  updatedContent = (matchedElements && matchedElements.length > 0 &&
    matchedElements[0].split('type=').length > 1 &&
    matchedElements[0].split('type=')[1].startsWith('"image')) ?
    content.replace(re, `<img alt="${resourceHashes[hash].fileName}" src="${src}">`) :
    content.replace(re, `<a href="${src}">${resourceHashes[hash].fileName}</a>`);

  return updatedContent;

};

const processResource = (workDir: string, resource: any): any => {
    const resourceHash:any = {};
    const data = resource.data.$text;

    const resourceFileProps = utils.getResourceFileProperties(workDir, resource);
    const fileName = resourceFileProps.fileName;
    const absFilePath = `${workDir}/${fileName}`;

    const accessTime = utils.getTimeStampMoment(resource);
    fs.writeFileSync(absFilePath, data, 'base64');

    const atime = accessTime.valueOf() / 1000;
    fs.utimesSync(absFilePath, atime, atime);

    // tslint:disable-next-line: curly
    if (resource.recognition && fileName) {
      const hashIndex = resource.recognition.match(/[a-f0-9]{32}/);
      resourceHash[hashIndex as any] = {fileName, alreadyUsed: false} as ResourceHashItem;
    } else {
      const md5Hash = md5File.sync(absFilePath);
      resourceHash[md5Hash] = {fileName, alreadyUsed: false} as ResourceHashItem;
    }
    
    return resourceHash;
};
