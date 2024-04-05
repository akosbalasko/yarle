import Moment from 'moment';
import { utimesSync } from 'utimes';

import { yarleOptions } from './../yarle';
import { MetaData } from './../models/MetaData';
import { EvernoteNoteData, NoteData } from './../models';
import { getHtmlFileLink } from './folder-utils';
import { escapeStringRegexp } from './escape-string-regexp';
import { OutputFormat } from './../output-format';

export const getMetadata = (note: EvernoteNoteData, notebookName: string): MetaData => {

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

export const getTitle = (note: EvernoteNoteData): string => {
  return note.title ? `# ${note.title}` : '';
};

export const getCreationTime = (note: EvernoteNoteData): string => {
  return !yarleOptions.skipCreationTime && note.created
  ? Moment(note.created).format(yarleOptions.dateFormat)
  : undefined;
};

export const getUpdateTime = (note: EvernoteNoteData): string => {
  return !yarleOptions.skipUpdateTime && note.updated
    ? Moment(note.updated).format(yarleOptions.dateFormat)
    : undefined;
};

export const getSourceUrl = (note: EvernoteNoteData): string => {
  return !yarleOptions.skipSourceUrl &&
    note['note-attributes']
    ? note['note-attributes']['source-url']
    : undefined;
};

export const getLinkToOriginal = (note: EvernoteNoteData): string => {
  return yarleOptions.keepOriginalHtml ?
    getHtmlFileLink(note) : undefined;
};

export const getLatLong = (note: EvernoteNoteData): string => {
  return !yarleOptions.skipLocation &&
    note['note-attributes'] &&
    note['note-attributes'].longitude
    ? `${note['note-attributes'].latitude},${note['note-attributes'].longitude}`
    : undefined;
};
export const getReminderTime = (note: EvernoteNoteData): string => {
  return !yarleOptions.skipReminderTime &&
    note['note-attributes'] &&
    note['note-attributes']['reminder-time']
    ? Moment(note['note-attributes']['reminder-time']).format(yarleOptions.dateFormat)
    : undefined;
};
export const getReminderOrder = (note: EvernoteNoteData): string => {
  return !yarleOptions.skipReminderOrder &&
    note['note-attributes'] &&
    note['note-attributes']['reminder-order']
    ? note['note-attributes']['reminder-order']
    : undefined;
};
export const getReminderDoneTime = (note: EvernoteNoteData): string => {
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
export const getTags = (note: EvernoteNoteData): string => {
  return logTags(note);

};

export const logTags = (note: EvernoteNoteData): string => {
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
      if (yarleOptions.outputFormat === OutputFormat.ObsidianMD)
        cleanTag = cleanTag.replace(/[^\wА-Яа-я0-9_/\\-]/g, '')
      return `${yarleOptions.useHashTags ? '#' : ''}${cleanTag}`;
    });

    return tags.join(' ');
  }

  return undefined;
};

export const setFileDates = (path: string, created?: string | Date, updated?: string | Date): void => {
  const createdTime = created ? Math.max(0, Moment(created).valueOf()) : 0;
  const updatedTime = updated ? Math.max(0, Moment(updated).valueOf()) : createdTime;

  utimesSync(path, {
    btime: createdTime,
    mtime: updatedTime,
    atime: updatedTime
  });
};

export const getTimeStampMoment = (resource: any): any => {
  return resource['resource-attributes'] &&
    resource['resource-attributes']['timestamp']
    ? Moment(resource['resource-attributes']['timestamp'])
    : Moment();
};
