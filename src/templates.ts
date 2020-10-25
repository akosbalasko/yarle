import * as fs from 'fs';

import { YarleOptions } from './YarleOptions';
import { NoteData } from './process-node';

const TITLE_PLACEHOLDER = '{title}';
const START_TITLE_BLOCK = '{title-block}';
const END_TITLE_BLOCK = '{end-title-block}';

const TAGS_PLACEHOLDER = '{tags}';
const START_TAGS_BLOCK = '{tags-block}';
const END_TAGS_BLOCK = '{end-tags-block}';

const CONTENT_PLACEHOLDER = '{content}';
const START_CONTENT_BLOCK = '{content-block}';
const END_CONTENT_BLOCK = '{end-content-block}';

const START_METADATA_BLOCK = '{metadata-block}';
const END_METADATA_BLOCK = '{end-metadata-block}';

const CREATED_AT_PLACEHOLDER = '{created-at}';
const UPDATED_AT_PLACEHOLDER = '{updated-at}';
const LOCATION_PLACEHOLDER = '{location}';

export const applyTemplate = (
  noteData: NoteData,
  yarleOptions: YarleOptions,
) => {
  let result = fs.readFileSync(
    yarleOptions.templateFile || './templates/default-template.txt',
    'utf-8',
  );

  if (noteData.title) {
    result = result
      .replace(TITLE_PLACEHOLDER, noteData.title)
      .replace(START_TITLE_BLOCK, '')
      .replace(END_TITLE_BLOCK, '');
  } else {
    result = result.replace(
      new RegExp(`${START_TITLE_BLOCK}(.*)${END_TITLE_BLOCK}`, 'g'),
      '',
    );
  }
  if (noteData.tags) {
    result = result
      .replace(TAGS_PLACEHOLDER, noteData.tags)
      .replace(START_TAGS_BLOCK, '')
      .replace(END_TAGS_BLOCK, '');
  } else {
    result = result.replace(
      new RegExp(`${START_TAGS_BLOCK}(.*)${END_TAGS_BLOCK}`, 'g'),
      '',
    );
  }
  if (noteData.content) {
    result = result
      .replace(CONTENT_PLACEHOLDER, noteData.content)
      .replace(START_CONTENT_BLOCK, '')
      .replace(END_CONTENT_BLOCK, '');
  } else {
    result = result.replace(
      new RegExp(`${START_CONTENT_BLOCK}(.*)${END_CONTENT_BLOCK}`, 'g'),
      '',
    );
  }
  if (yarleOptions.isMetadataNeeded) {
    result = result
      .replace(CREATED_AT_PLACEHOLDER, noteData.createdAt)
      .replace(UPDATED_AT_PLACEHOLDER, noteData.updatedAt)
      .replace(LOCATION_PLACEHOLDER, noteData.location)
      .replace(START_METADATA_BLOCK, '')
      .replace(END_METADATA_BLOCK, '');
  } else {
    result = result.replace(
      new RegExp(`${START_METADATA_BLOCK}(.*)${END_METADATA_BLOCK}`, 'g'),
      '',
    );
  }

  return result;
};
