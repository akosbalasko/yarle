import * as fs from 'fs';
import * as T from './placeholders/metadata-placeholders';
import { defaultTemplate } from './default-template';
import { YarleOptions } from '../../YarleOptions';
import { NoteData } from '../../models/NoteData';
import {
  applyTitleTemplate,
  applyTagsTemplate,
  applyContentTemplate,
  applyCreatedAtTemplate,
  applyUpdatedAtTemplate,
  applySourceUrlTemplate,
  applyLocationTemplate,
  applyNotebookTemplate } from './apply-functions';

import {
  removeUpdatedAtPlaceholder,
  removeCreatedAtPlaceholder,
  removeSourceUrlPlaceholder,
  removeLocationPlaceholder,
  removeNotebookPlaceholder,
  removeMetadataBlockPlaceholder } from './remove-functions';

export const applyTemplate = (noteData: NoteData, yarleOptions: YarleOptions) => {
  let result = defaultTemplate;
  if (yarleOptions.templateFile) {
    // todo: handle file not exists error
    result = fs.readFileSync(yarleOptions.templateFile, 'utf-8');
  }

  result = applyTitleTemplate(noteData, result, () => noteData.title);
  result = applyTagsTemplate(noteData, result, () => !yarleOptions.skipTags);
  result = applyContentTemplate(noteData, result, () => noteData.content);

  if (yarleOptions.isMetadataNeeded) {

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

    result = result
      .replace(T.START_BLOCK, '')
      .replace(T.END_BLOCK, '');
  } else {
    result = removeMetadataBlockPlaceholder(result);
  }

  return result;
};
