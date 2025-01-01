import * as fs from 'fs';
import { cloneDeep } from 'lodash';

import { YarleOptions } from '../../YarleOptions';
import { NoteData } from '../../models/NoteData';
import { TOCNoteName } from './../../constants';
import * as T from './placeholders/metadata-placeholders';
import * as M from './match-all';
import {
  applyContentTemplate,
  applyCreatedAtTemplate,
  applyLinkToOriginalTemplate,
  applyLocationTemplate,
  applyAltitudeTemplate,
  applyNotebookTemplate,
  applyReminderDoneTimeTemplate,
  applyReminderOrderTemplate,
  applyReminderTimeTemplate,
  applySubjectDateTemplate,
  applyAuthorTemplate,
  applySourceTemplate,
  applySourceUrlTemplate,
  applySourceApplicationTemplate,
  applyPlaceNameTemplate,
  applyContentClassTemplate,
  applyApplicationDataTemplate,
  applyTagsArrayTemplate,
  applyTagsTemplate,
  applyTitleTemplate,
  applyUpdatedAtTemplate,
  applyEvernoteLinkTemplate,
  applyEvernoteGuidTemplate,
  applyTagsYamlListTemplate
  } from './apply-functions';
import {
  removeCreatedAtPlaceholder,
  removeLinkToOriginalTemplate,
  removeLocationPlaceholder,
  removeAltitudePlaceholder,
  removeMetadataBlockPlaceholder,
  removeNotebookPlaceholder,
  removeReminderDoneTimePlaceholder,
  removeReminderOrderPlaceholder,
  removeReminderTimePlaceholder,
  removeSubjectDatePlaceholder,
  removeAuthorPlaceholder,
  removeSourcePlaceholder,
  removeSourceUrlPlaceholder,
  removeSourceApplicationPlaceholder,
  removePlaceNamePlaceholder,
  removeContentClassPlaceholder,
  removeApplicationDataPlaceholder,
  removeUpdatedAtPlaceholder,
  removeEvernoteLinkPlaceholder,
  removeEvernoteGuidPlaceholder
 } from './remove-functions';

export const applyTemplate = (noteData: NoteData, yarleOptions: YarleOptions) => {

  let result = cloneDeep(yarleOptions.currentTemplate);

  result = applyTitleTemplate(noteData, result, () => noteData.title);
  result = applyTagsTemplate(noteData, result, () => !yarleOptions.skipTags);
  result = applyTagsArrayTemplate(noteData, result, () => !yarleOptions.skipTags );
  result = applyTagsYamlListTemplate(noteData, result, () => !yarleOptions.skipTags);
  result = noteData.title === TOCNoteName
    ? removeEvernoteLinkPlaceholder(result)
    : applyEvernoteLinkTemplate(noteData, result)

  result = noteData.title === TOCNoteName
    ? removeEvernoteGuidPlaceholder(result) 
    : applyEvernoteGuidTemplate(noteData, result)

  result = applyContentTemplate(noteData, result, () => noteData.markdownContent);

  result = (yarleOptions.keepOriginalHtml && noteData.linkToOriginal)
      ? applyLinkToOriginalTemplate(noteData, result)
      : removeLinkToOriginalTemplate(result);

  result = (!yarleOptions.skipCreationTime && noteData.createdAt)
      ? applyCreatedAtTemplate(noteData, result)
      : removeCreatedAtPlaceholder(result);

  result = (!yarleOptions.skipUpdateTime && noteData.updatedAt)
      ? applyUpdatedAtTemplate(noteData, result)
      : removeUpdatedAtPlaceholder(result);

  result = (!yarleOptions.skipSubjectDate && noteData.subjectDate)
      ? applySubjectDateTemplate(noteData, result)
      : removeSubjectDatePlaceholder(result);

  result = (!yarleOptions.skipAuthor && noteData.author)
      ? applyAuthorTemplate(noteData, result)
      : removeAuthorPlaceholder(result);

  result = (!yarleOptions.skipSource && noteData.source)
      ? applySourceTemplate(noteData, result)
      : removeSourcePlaceholder(result);

  result = (!yarleOptions.skipSourceUrl && noteData.sourceUrl)
      ? applySourceUrlTemplate(noteData, result)
      : removeSourceUrlPlaceholder(result);

  result = (!yarleOptions.skipSourceApplication && noteData.sourceApplication)
      ? applySourceApplicationTemplate(noteData, result)
      : removeSourceApplicationPlaceholder(result);

  result = (!yarleOptions.skipLocation && noteData.location)
      ? applyLocationTemplate(noteData, result)
      : removeLocationPlaceholder(result);

  result = (!yarleOptions.skipAltitude && noteData.altitude)
      ? applyAltitudeTemplate(noteData, result)
      : removeAltitudePlaceholder(result);

  result = (!yarleOptions.skipPlaceName && noteData.placeName)
      ? applyPlaceNameTemplate(noteData, result)
      : removePlaceNamePlaceholder(result);

  result = (!yarleOptions.skipContentClass && noteData.contentClass)
      ? applyContentClassTemplate(noteData, result)
      : removeContentClassPlaceholder(result);
  
  result = (!yarleOptions.skipApplicationData && noteData.applicationData)
      ? applyApplicationDataTemplate(noteData, result)
      : removeApplicationDataPlaceholder(result);

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
