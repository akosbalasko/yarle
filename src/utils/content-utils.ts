import Moment from 'moment';
import fs from 'fs';

import { yarleOptions } from './../yarle';
import { MetaData } from './../models/MetaData';
import { NoteData } from './../models';

export const getMetadata = (note: any): MetaData => {

  return yarleOptions.isMetadataNeeded
    ? {
        createdAt: getCreationTime(note),
        updatedAt: getUpdateTime(note),
        location: getLatLong(note),
      }
    : {
      };
  };

export const getTitle = (note: any): string => {
  return note.title ? `# ${note.title}` : '';
};

export const getCreationTime = (note: any): string => {
  return !yarleOptions.skipCreationTime && note.created
    ? Moment(note.created).format()
    : '';
};

export const getUpdateTime = (note: any): string => {
  return !yarleOptions.skipUpdateTime && note.updated
    ? Moment(note.updated).format()
    : '';
};

export const getLatLong = (note: any): string => {
  return !yarleOptions.skipLocation &&
    note['note-attributes'] &&
    note['note-attributes'].longitude
    ? `${note['note-attributes'].longitude},${note['note-attributes'].latitude}`
    : '';
};
export const getTags = (note: any): NoteData => {
  return yarleOptions.isMetadataNeeded ? {tags: logTags(note)} : {};

};
export const logTags = (note: any): string => {
  if (!yarleOptions.skipTags && note.tag) {
    const tagArray = Array.isArray(note.tag) ? note.tag : [note.tag];
    const tags = tagArray.map((tag: any) => {
      const cleanTag = tag.toString().replace(/ /g, '-');

      return cleanTag.startsWith('#') ? cleanTag : `#${cleanTag}`;
    });

    return tags.join(' ');
  }

  return '';
};

export const setFileDates = (path: string, note: any): void => {
  const modificationTime = Moment(note.updated);
  const mtime = modificationTime.valueOf() / 1000;
  fs.utimesSync(path, mtime, mtime);
};

export const getTimeStampMoment = (resource: any): any => {
  return resource['resource-attributes'] &&
    resource['resource-attributes']['timestamp']
    ? Moment(resource['resource-attributes']['timestamp'])
    : Moment();
};
