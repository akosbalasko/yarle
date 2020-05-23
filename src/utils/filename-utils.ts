import * as fs from 'fs';
import * as moment from 'moment';

import { yarleOptions } from '../yarle';

const FILENAME_LENGTH = 50;

export const getFileIndex = (dstPath: string, fileNamePrefix: string): number | string => {

  const index = fs
    .readdirSync(dstPath)
    .filter(file => file.indexOf(fileNamePrefix) > -1)
    .length;

  return index;

};

export const getFilePrefix = (note: any): string => {
  return (note['title'] ? `${note['title'].toString()}` : 'Untitled')
  .substring(0, FILENAME_LENGTH)
  .replace(/[\\/!.;+:_\?]+/g, ' ')
  .toLowerCase();

  };

export const getNoteFileName = (dstPath: string, note: any): string => {
  return `${getNoteName(dstPath, note)}.md`;
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
