import * as fs from 'fs';
import * as moment from 'moment';

import { yarleOptions } from '../yarle';

const FILENAME_LENGTH = 50;

export const getFileIndex = (dstPath: string, note: any): number | string => {

    const fileNamePrefix = getFilePrefix(note);
    const indexList = fs.readdirSync(dstPath)
                        .filter(file => file.indexOf(fileNamePrefix) > -1)
                        .map(file => {
                          const nameParts = file.split('.');

                          return (nameParts.length <= 2) ? 0 : Number(nameParts[1]);
                      });

    return indexList.length !== 0 ? Math.max(...indexList) + 1 : '';

  };

export const getFilePrefix = (note: any): string => {
  let fileName = '';
  if (yarleOptions.isZettelkastenNeeded) {
    fileName += `${getZettelKastelId(note)}`;
    if (note['title']) {
      fileName += `| ${note['title'].toString()}`;
    }
  } else { fileName +=
    note['title'] ? `${note['title'].toString()}` : 'Untitled';
  }
  fileName = fileName
  .substring(0, FILENAME_LENGTH)
  .replace(/[\\/!.;+:_\?]+/g, ' ')
  .toLowerCase();

  return fileName;
  };

export const getNoteFileName = (dstPath: string, note: any): string => {
  return `${getNoteName(dstPath, note)}.md`;
};

export const getZettelKastelId = (note: any): string => {
  return moment(note['created']).format('YYYYMMDDhhmm');
};

export const getNoteName = (dstPath: string, note: any): string => {
    const fileNamePrefix = getFilePrefix(note);
    const nextIndex = getFileIndex(dstPath, note);

    return (nextIndex === '') ? fileNamePrefix :  `${fileNamePrefix}.${nextIndex}`;

};
