import { EOL } from 'os';
import * as moment from 'moment';
import * as fs from 'fs';

import { getFileIndex } from './filename-utils';

export const getMetadata = (note: any): string => {
    return ''.concat(logSeparator())
             .concat(logCreationTime(note))
             .concat(logUpdateTime(note))
             .concat(logLatLong(note))
             .concat(logTags(note))
             .concat(logSeparator());

};

export const getTitle = (dstPath: string, note: any): string => {
    const index = getFileIndex(dstPath, note);
    if (index  === '')
      return note['title']
           ? `# ${note['title']}${EOL}`
           : '';
    else
      return note['title']
             ? `# ${note['title']}.${index}${EOL}`
             : '';
};

export const logCreationTime = (note: any): string => {
    return note['created']
           ? `    Created at: ${moment(note['created']).format()}${EOL}`
           : '';
  };

export const logUpdateTime = (note: any): string => {
  return note['updated']
          ? `    Updated at: ${moment(note['updated']).format()}${EOL}`
          : '';
};

export const logLatLong = (note: any): string => {
  return (note['note-attributes'] && note['note-attributes']['longitude'])
          ? `    Where: ${note['note-attributes']['longitude']},${note['note-attributes']['latitude']}${EOL}`
          : '';
};

export const logTags = (note: any): string => {
  return note['tag']
          ? `    Tag(s): ${note['tag']}${EOL}`
          : '';
};

export const logSeparator = (): string => {
  return `${EOL}${EOL}`;
};

export const setFileDates = (path: string, note: any): void => {
  const modificationTime = moment(note['updated']);
  const mtime = modificationTime.valueOf() / 1000;
  fs.utimesSync(path, mtime, mtime);
};