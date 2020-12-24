import Moment from 'moment';
import fs from 'fs';

import { yarleOptions } from './../yarle';
import { MetaData } from './../models/MetaData';
import { NoteData } from './../models';
import { getHtmlFileLink } from './folder-utils';

export const getMetadata = (note: any, notebookName: string): MetaData => {

  return yarleOptions.isMetadataNeeded
    ? {
        createdAt: getCreationTime(note),
        updatedAt: getUpdateTime(note),
        sourceUrl: getSourceUrl(note),
        location: getLatLong(note),
        linkToOriginal: getLinkToOriginal(note),
        notebookName,
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
    : undefined;
};

export const getUpdateTime = (note: any): string => {
  return !yarleOptions.skipUpdateTime && note.updated
    ? Moment(note.updated).format()
    : undefined;
};

export const getSourceUrl = (note: any): string => {
  return !yarleOptions.skipSourceUrl &&
    note['note-attributes']
    ? note['note-attributes']['source-url']
    : undefined;
};

export const getLinkToOriginal = (note: any): string => {
  return yarleOptions.keepOriginalHtml ?
    getHtmlFileLink(note) : undefined;
};

export const getLatLong = (note: any): string => {
  return !yarleOptions.skipLocation &&
    note['note-attributes'] &&
    note['note-attributes'].longitude
    ? `${note['note-attributes'].longitude},${note['note-attributes'].latitude}`
    : undefined;
};
export const getTags = (note: any): NoteData => {
  return yarleOptions.isMetadataNeeded ? {tags: logTags(note)} : undefined;

};

export const logTags = (note: any): string => {
  if (!yarleOptions.skipTags && note.tag) {
    const tagArray = Array.isArray(note.tag) ? note.tag : [note.tag];
    const tags = tagArray.map((tag: any) => {
      const cleanTag = tag.toString().replace(/^#/, '').replace(/ /g, '-');

      return yarleOptions.useHashTags ? `#${cleanTag}` : cleanTag;
    });

    return tags.join(' ');
  }

  return undefined;
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
