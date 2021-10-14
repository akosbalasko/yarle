import sanitize from 'sanitize-filename';
import * as fs from 'fs';
import Moment from 'moment';
import * as path from 'path';
import * as mime from 'mime-types';

import { yarleOptions } from '../yarle';

import { ResourceFileProperties } from './../models/ResourceFileProperties';
import { OutputFormat } from './../output-format';
import { getCreationTime } from './content-utils';

const FILENAME_DELIMITER = '_';

export const normalizeTitle = (title: string) => {
  return sanitize(title, {replacement: FILENAME_DELIMITER});
};

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
  fileName = fileName.replace(/[/\\?%*:|"<>]/g, '-');
  const index = getFileIndex(workDir, fileName);
  const fileNameWithIndex = index > 0 ? `${fileName}.${index}` : fileName;

  return {
    fileName: `${fileNameWithIndex}.${extension}`,
    extension,
    index,
  };
};

export const getFilePrefix = (note: any): string => {
  return normalizeTitle(note['title'] ? `${note['title'].toString()}` : 'Untitled');
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
  const mimeType = resource.mime;
  if (!mimeType) {
    return undefined;
  }

  return mime.extension(mimeType);
};

export const getExtension = (resource: any): string => {
  const UNKNOWNEXTENSION = 'dat';

  return getExtensionFromResourceFileName(resource) || getExtensionFromMime(resource) || UNKNOWNEXTENSION;
};

export const getZettelKastelId = (note: any, dstPath: string): string => {
  return Moment(note['created']).format('YYYYMMDDHHmm');

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

    noteName += getFilePrefix(note) !== 'Untitled' ? `${separator}${getFilePrefix(note)}` : '';
  } else {
    const fileNamePrefix = getFilePrefix(note);
    const nextIndex = getFileIndex(dstPath, fileNamePrefix);

    noteName = (nextIndex === 0) ? fileNamePrefix :  `${fileNamePrefix}.${nextIndex}`;
  }
  if (yarleOptions.outputFormat === OutputFormat.LogSeqMD && yarleOptions.logseqSettings.journalNotes) {
    return getCreationTime(note);
  }

  return noteName;

};

export const getNotebookName = (enexFile: string): string => {
  const notebookName = path.basename(enexFile, '.enex');

  return notebookName;
};
