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

const MATCH_ALL = '(.|\n|\r\n)*';

export const applyTemplate = (
  noteData: NoteData,
  yarleOptions: YarleOptions,
) => {
  let result = `${defaultTemplate}`;
  if (yarleOptions.templateFile) {
    // todo: handle file not exists error
    result = fs.readFileSync(yarleOptions.templateFile, 'utf-8');
  }

  result = applyTemplateOnBlock({
    template: result,
    check: () => noteData.title,
    startBlockPlaceholder: START_TITLE_BLOCK,
    endBlockPlaceholder: END_TITLE_BLOCK,
    valuePlaceholder: TITLE_PLACEHOLDER,
    value: noteData.title,
  });

  result = applyTemplateOnBlock({
    template: result,
    check: () => !yarleOptions.skipTags,
    startBlockPlaceholder: START_TAGS_BLOCK,
    endBlockPlaceholder: END_TAGS_BLOCK,
    valuePlaceholder: TAGS_PLACEHOLDER,
    value: noteData.tags,
  });

  result = applyTemplateOnBlock({
    template: result,
    check: () => noteData.content,
    startBlockPlaceholder: START_CONTENT_BLOCK,
    endBlockPlaceholder: END_CONTENT_BLOCK,
    valuePlaceholder: CONTENT_PLACEHOLDER,
    value: noteData.content,
  });

  if (yarleOptions.isMetadataNeeded) {
    if (!yarleOptions.skipCreationTime && noteData.createdAt) {
      result = result
        .replace(CREATED_AT_PLACEHOLDER, noteData.createdAt)
        .replace(START_CREATED_AT_BLOCK, '')
        .replace(END_CREATED_AT_BLOCK, '');
    } else {
      result = result.replace(
        new RegExp(
          `${START_CREATED_AT_BLOCK}${MATCH_ALL}${END_CREATED_AT_BLOCK}`,
          'g',
        ),
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
        new RegExp(
          `${START_UPDATED_AT_BLOCK}${MATCH_ALL}${END_UPDATED_AT_BLOCK}`,
          'g',
        ),
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
        new RegExp(
          `${START_LOCATION_BLOCK}${MATCH_ALL}${END_LOCATION_BLOCK}`,
          'g',
        ),
        '',
      );
    }
    result = result
      .replace(START_METADATA_BLOCK, '')
      .replace(END_METADATA_BLOCK, '');
  } else {
    result = result.replace(
      new RegExp(
        `${START_METADATA_BLOCK}${MATCH_ALL}${END_METADATA_BLOCK}`,
        'g',
      ),
      '',
    );
  }

  return result;
};

function applyTemplateOnBlock({
  template,
  check,
  startBlockPlaceholder,
  endBlockPlaceholder,
  valuePlaceholder,
  value,
}: {
  template: string;
  check: Function;
  startBlockPlaceholder: string;
  endBlockPlaceholder: string;
  valuePlaceholder: string;
  value: string;
}): string {
  if (value && check()) {
    return template
      .replace(startBlockPlaceholder, '')
      .replace(endBlockPlaceholder, '')
      .replace(valuePlaceholder, value);
  }

  return template.replace(
    new RegExp(
      `${startBlockPlaceholder}${MATCH_ALL}${endBlockPlaceholder}`,
      'g',
    ),
    '',
  );
}
