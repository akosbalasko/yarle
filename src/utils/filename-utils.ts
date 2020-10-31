import * as fs from 'fs';
import * as moment from 'moment';

import { yarleOptions } from '../yarle';

import { ResourceFileProperties } from './../models/ResourceFileProperties';

const FILENAME_LENGTH = 50;
const FILENAME_DELIMITER = '_';

export const getFileIndex = (dstPath: string, fileNamePrefix: string): number | string => {

  const index = fs
    .readdirSync(dstPath)
    .filter(file => file.indexOf(fileNamePrefix) > -1)
    .length;

  return index;

};
export const getResourceFileProperties = (workDir: string, resource: any): ResourceFileProperties => {
  const UNKNOWNFILENAME = 'unknown_filename';

  const extension = getExtension(resource);
  let fileName = UNKNOWNFILENAME;

  if (resource['resource-attributes'] && resource['resource-attributes']['file-name']) {
    const fileNamePrefix = resource['resource-attributes']['file-name'].substr(0, 50);

    fileName = fileNamePrefix.split('.')[0];

  }

  const index = getFileIndex(workDir, fileName);
  const fileNameWithIndex = index > 0 ? `${fileName}.${index}` : fileName;

  return {
    fileName: `${fileNameWithIndex}.${extension}`,
    extension,
    index,
  };
};

export const getFilePrefix = (note: any): string => {
  const cutName = (note['title'] ? `${note['title'].toString()}` : 'Untitled').substring(0, FILENAME_LENGTH);

  return makeFilePrefixOsCompatible(cutName).toLowerCase();

  };
export const makeFilePrefixOsCompatible = (name: string): string => {
  return name.replace(/(\!|\.|\;|\:|\<|\>|\"|\\|\/|\||\*|\?)/g, FILENAME_DELIMITER);
};

export const getNoteFileName = (dstPath: string, note: any): string => {
  return `${getNoteName(dstPath, note)}.md`;
};
export const getExtensionFromResourceFileName = (resource: any): string => {
  if (!(resource['resource-attributes'] &&
      resource['resource-attributes']['file-name'])) {
      return undefined;
  }
  const splitFileName = resource['resource-attributes']['file-name'].split('.');

  return splitFileName.length > 1 ? splitFileName[splitFileName.length - 1] : undefined;

};
export const getExtensionFromMime = (resource: any): string => {
  const mime = resource.mime;
  if (!mime) {
    return undefined;
  }
  const splitMime = mime.split('/');

  return splitMime.length > 1 ?
    splitMime[1] : undefined;
};

export const getExtension = (resource: any): string => {
  const UNKNOWNEXTENSION = 'dat';

  return getExtensionFromMime(resource) || getExtensionFromResourceFileName(resource) || UNKNOWNEXTENSION;
};

export const getZettelKastelId = (note: any, dstPath: string): string => {
  return moment(note['created']).format('YYYYMMDDhhmm');

};

export const getNoteName = (dstPath: string, note: any): string => {

  let noteName;

  if (yarleOptions.isZettelkastenNeeded) {
    const zettelPrefix = getZettelKastelId(note, dstPath);
    const nextIndex = getFileIndex(dstPath, zettelPrefix);
    const separator = ' ';
    noteName = (nextIndex !== 0) ?
      `${zettelPrefix}.${nextIndex}` :
      zettelPrefix;

    noteName += getFilePrefix(note).toLowerCase() !== 'untitled' ? `${separator}${getFilePrefix(note)}` : '';
  } else {
    const fileNamePrefix = getFilePrefix(note);
    const nextIndex = getFileIndex(dstPath, fileNamePrefix);

    noteName = (nextIndex === 0) ? fileNamePrefix :  `${fileNamePrefix}.${nextIndex}`;
  }

  return noteName;

};
