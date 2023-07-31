import * as fs from 'fs';
import { cloneDeep } from 'lodash';

import { YarleOptions } from '../../YarleOptions';
import { NoteData } from '../../models/NoteData';

import * as T from './placeholders/metadata-placeholders';
import * as M from './match-all';
import {
  applyContentTemplate,
  applyCreatedAtTemplate,
  applyLinkToOriginalTemplate,
  applyLocationTemplate,
  applyNotebookTemplate,
  applyReminderDoneTimeTemplate,
  applyReminderOrderTemplate,
  applyReminderTimeTemplate,
  applySourceUrlTemplate,
  applyTagsArrayTemplate,
  applyTagsTemplate,
  applyTitleTemplate,
  applyUpdatedAtTemplate,
  } from './apply-functions';
import {
  removeCreatedAtPlaceholder,
  removeLinkToOriginalTemplate,
  removeLocationPlaceholder,
  removeMetadataBlockPlaceholder,
  removeNotebookPlaceholder,
  removeReminderDoneTimePlaceholder,
  removeReminderOrderPlaceholder,
  removeReminderTimePlaceholder,
  removeSourceUrlPlaceholder,
  removeUpdatedAtPlaceholder,
 } from './remove-functions';

export const applyTemplate = (noteData: NoteData, yarleOptions: YarleOptions) => {

  let result = cloneDeep(yarleOptions.currentTemplate);

  result = applyTitleTemplate(noteData, result, () => noteData.title);
  result = applyTagsTemplate(noteData, result, () => !yarleOptions.skipTags);
  result = applyTagsArrayTemplate(noteData, result, () => !yarleOptions.skipTags);

  result = applyContentTemplate(noteData, result, () => noteData.content);

  result = (yarleOptions.keepOriginalHtml && noteData.linkToOriginal)
      ? applyLinkToOriginalTemplate(noteData, result)
      : removeLinkToOriginalTemplate(result);

  result = (!yarleOptions.skipCreationTime && noteData.createdAt)
      ? applyCreatedAtTemplate(noteData, result)
      : removeCreatedAtPlaceholder(result);

  result = (!yarleOptions.skipUpdateTime && noteData.updatedAt)
      ? applyUpdatedAtTemplate(noteData, result)
      : removeUpdatedAtPlaceholder(result);

  result = (!yarleOptions.skipSourceUrl && noteData.sourceUrl)
      ? applySourceUrlTemplate(noteData, result)
      : removeSourceUrlPlaceholder(result);

  result = (!yarleOptions.skipLocation && noteData.location)
      ? applyLocationTemplate(noteData, result)
      : removeLocationPlaceholder(result);

  result = (yarleOptions.isNotebookNameNeeded && noteData.notebookName)
      ? applyNotebookTemplate(noteData, result)
      : removeNotebookPlaceholder(result);

  result = (!yarleOptions.skipReminderTime && noteData.reminderTime)
    ? applyReminderTimeTemplate(noteData, result)
    : removeReminderTimePlaceholder(result);

  result = (!yarleOptions.skipReminderOrder && noteData.reminderOrder)
    ? applyReminderOrderTemplate(noteData, result)
    : removeReminderOrderPlaceholder(result);

  result = (!yarleOptions.skipReminderDoneTime && noteData.reminderDoneTime)
    ? applyReminderDoneTimeTemplate(noteData, result)
    : removeReminderDoneTimePlaceholder(result);

  result = result.replace(T.START_BLOCK, '')
      .replace(T.END_BLOCK, '');

  return result;
};
