import * as fs from 'fs';
import * as moment from 'moment';
import * as fsExtra from 'fs-extra';
import { EOL } from 'os';

const FILENAME_LENGTH = 50;

export const getNoteFileName = (dstPath: string, note: any): string => {
  return `${getNoteName(dstPath, note)}.md`;
};

export const getNoteName = (dstPath: string, note: any): string => {
    const fileNamePrefix = getFilePrefix(note);
    const nextIndex = getFileIndex(dstPath, note);

    return (nextIndex === '') ? fileNamePrefix :  `${fileNamePrefix}.${nextIndex}`;

};

export const getResourceDir = (dstPath: string, note: any): string => {
  const noteFileName = getNoteName(dstPath, note);

  return noteFileName.replace(/ /g, '_');
};

export const getFilePrefix = (note: any): string => {
  const fName = note['title'] ? note['title'].toString() : 'Untitled';

  return fName
    .substring(0, FILENAME_LENGTH)
    .replace(/[\\/!.;+:_\?]+/g, ' ')
    .toLowerCase();
};

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

export const getFilePath = (dstPath: string, note: any): string => {

  return `${dstPath}/${getNoteFileName(dstPath, note)}`;

};

export const getMetadata = (note: any): string => {
    return ''.concat(logSeparator())
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

export const clearDistDir = (dstPath: string): void => {
    if (fs.existsSync(dstPath))
        fsExtra.removeSync(dstPath);
    fs.mkdirSync(dstPath);
};
