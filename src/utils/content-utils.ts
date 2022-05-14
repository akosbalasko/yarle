import Moment from 'moment';
import { utimesSync } from 'fs';
import { utimes } from 'utimes';

import { yarleOptions } from './../yarle';
import { MetaData } from './../models/MetaData';
import { NoteData } from './../models';
import { getHtmlFileLink } from './folder-utils';
import { escapeStringRegexp } from './escape-string-regexp';

export const getMetadata = (note: any, notebookName: string): MetaData => {

  return {
        createdAt: getCreationTime(note),
        updatedAt: getUpdateTime(note),
        sourceUrl: getSourceUrl(note),
        location: getLatLong(note),
        linkToOriginal: getLinkToOriginal(note),
        reminderTime: getReminderTime(note),
        reminderOrder: getReminderOrder(note),
        reminderDoneTime: getReminderDoneTime(note),
        notebookName,
      };
};

export const getTitle = (note: any): string => {
  return note.title ? `# ${note.title}` : '';
};

export const getCreationTime = (note: any): string => {
  return !yarleOptions.skipCreationTime && note.created
  ? Moment(note.created).format(yarleOptions.dateFormat)
  : undefined;
};

export const getUpdateTime = (note: any): string => {
  return !yarleOptions.skipUpdateTime && note.updated
    ? Moment(note.updated).format(yarleOptions.dateFormat)
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
    ? `${note['note-attributes'].latitude},${note['note-attributes'].longitude}`
    : undefined;
};
export const getReminderTime = (note: any): string => {
  return !yarleOptions.skipReminderTime &&
    note['note-attributes'] &&
    note['note-attributes']['reminder-time']
    ? Moment(note['note-attributes']['reminder-time']).format(yarleOptions.dateFormat)
    : undefined;
};
export const getReminderOrder = (note: any): string => {
  return !yarleOptions.skipReminderOrder &&
    note['note-attributes'] &&
    note['note-attributes']['reminder-order']
    ? note['note-attributes']['reminder-order']
    : undefined;
};
export const getReminderDoneTime = (note: any): string => {
  return !yarleOptions.skipReminderDoneTime &&
    note['note-attributes'] &&
    note['note-attributes']['reminder-done-time']
    ? Moment(note['note-attributes']['reminder-done-time']).format(yarleOptions.dateFormat)
    : undefined;
};
/*
<reminder-order>
<reminder-time>
<reminder-done-time> */
export const getTags = (note: any): NoteData => {
  return {tags: logTags(note)};

};

export const logTags = (note: any): string => {
  if (!yarleOptions.skipTags && note.tag) {
    const tagArray = Array.isArray(note.tag) ? note.tag : [note.tag];
    const tagOptions = yarleOptions.nestedTags;

    const tags = tagArray.map((tag: any) => {
      let cleanTag = tag
        .toString()
        .replace(/^#/, '');
      if (tagOptions) {
        cleanTag = cleanTag.replace(new RegExp(escapeStringRegexp(tagOptions.separatorInEN), 'g'), tagOptions.replaceSeparatorWith);
      }

      const replaceSpaceWith = (tagOptions && tagOptions.replaceSpaceWith) || '-';

      cleanTag = cleanTag.replace(/ /g, replaceSpaceWith);

      return `${yarleOptions.useHashTags ? '#' : ''}${cleanTag}`;
    });

    return tags.join(' ');
  }

  return undefined;
};

export const setFileDates = (path: string, note: any): void => {
  const updated = Moment(note.updated).valueOf();
  const mtime = updated / 1000;
  utimesSync(path, mtime, mtime);
  // also set creation time where supported
  const creationTime = Moment(note.created);

  const created = (Moment('1970-01-01 00:00:00.000').isBefore(creationTime)
    ? creationTime
    : Moment('1970-01-01 00:00:00.001')).valueOf();
  if (created) {
    utimes(path, {btime: created});
  }
};

export const getTimeStampMoment = (resource: any): any => {
  return resource['resource-attributes'] &&
    resource['resource-attributes']['timestamp']
    ? Moment(resource['resource-attributes']['timestamp'])
    : Moment();
};
