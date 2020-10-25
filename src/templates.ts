import * as fs from 'fs';

import { defaultTemplate } from './default-template';
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
const START_CREATED_AT_BLOCK = '{created-at-block}';
const END_CREATED_AT_BLOCK = '{end-created-at-block}';

const UPDATED_AT_PLACEHOLDER = '{updated-at}';
const START_UPDATED_AT_BLOCK = '{updated-at-block}';
const END_UPDATED_AT_BLOCK = '{end-updated-at-block}';

const LOCATION_PLACEHOLDER = '{location}';
const START_LOCATION_BLOCK = '{location-block}';
const END_LOCATION_BLOCK = '{end-location-block}';

export const applyTemplate = (
  noteData: NoteData,
  yarleOptions: YarleOptions,
) => {
  let result = `${defaultTemplate}`;
  if (yarleOptions.templateFile) {
    // todo: handle file not exists error
    result = fs.readFileSync(yarleOptions.templateFile, 'utf-8');
  }

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
  if (!yarleOptions.skipTags && noteData.tags) {
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
    if (!yarleOptions.skipCreationTime && noteData.createdAt) {
      result = result
        .replace(CREATED_AT_PLACEHOLDER, noteData.createdAt)
        .replace(START_CREATED_AT_BLOCK, '')
        .replace(END_CREATED_AT_BLOCK, '');
    } else {
      result = result.replace(
        new RegExp(`${START_CREATED_AT_BLOCK}(.*)${END_CREATED_AT_BLOCK}`, 'g'),
        '',
      );
    }
    if (!yarleOptions.skipUpdateTime && noteData.updatedAt) {
      result = result
        .replace(UPDATED_AT_PLACEHOLDER, noteData.updatedAt)
        .replace(START_UPDATED_AT_BLOCK, '')
        .replace(END_UPDATED_AT_BLOCK, '');
    } else {
      result = result.replace(
        new RegExp(`${START_UPDATED_AT_BLOCK}(.*)${END_UPDATED_AT_BLOCK}`, 'g'),
        '',
      );
    }
    if (!yarleOptions.skipLocation && noteData.location) {
      result = result
        .replace(LOCATION_PLACEHOLDER, noteData.location)
        .replace(START_LOCATION_BLOCK, '')
        .replace(END_LOCATION_BLOCK, '');
    } else {
      result = result.replace(
        new RegExp(`${START_LOCATION_BLOCK}(.*)${END_LOCATION_BLOCK}`, 'g'),
        '',
      );
    }
    result = result
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
