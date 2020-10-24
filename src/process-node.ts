import {
  getComplexFilePath,
  getMetadata,
  getNoteContent,
  getSimpleFilePath,
  getTitle,
  isComplex,
  logTags,
} from './utils';
import { yarleOptions } from './yarle';
import { writeMdFile } from './utils/file-utils';
import { processResources } from './process-resources';
import { convertHtml2Md } from './convert-html-to-md';

interface NoteData {
  title?: string;
  tags?: string;
  content?: string;
  metadata?: string;
}

const TITLE_PLACEHOLDER = '{% title %}';
const TAGS_PLACEHOLDER = '{% tags %}';
const CONTENT_PLACEHOLDER = '{% content %}';
const METADATA_PLACEHOLDER = '{% metadata %}';

const defaultTemplate = `${TITLE_PLACEHOLDER}${TAGS_PLACEHOLDER}${CONTENT_PLACEHOLDER}${METADATA_PLACEHOLDER}`;

export const processNode = (note: any): void => {
  const title = getTitle(note);
  const noteData: NoteData = { title };

  console.log(`Converting note ${title}...`);

  try {
    let content = getNoteContent(note);

    noteData.tags = yarleOptions.isMetadataNeeded ? logTags(note) : '';

    if (isComplex(note)) {
      content = processResources(note, content);
    }

    noteData.content = convertHtml2Md(content);

    noteData.metadata = yarleOptions.isMetadataNeeded ? getMetadata(note) : '';

    const data = applyTemplate(noteData, defaultTemplate);

    const absFilePath = isComplex(note)
      ? getComplexFilePath(note)
      : getSimpleFilePath(note);

    writeMdFile(absFilePath, data, note);
  } catch (e) {
    console.log(`Failed to convert note: ${title}`, e);
  }
  console.log(`Note ${title} converted successfully.`);
};

const applyTemplate = (noteData: NoteData, template: string) =>
  template
    .replace(TITLE_PLACEHOLDER, noteData.title || '')
    .replace(TAGS_PLACEHOLDER, noteData.tags || '')
    .replace(CONTENT_PLACEHOLDER, noteData.content || '')
    .replace(METADATA_PLACEHOLDER, noteData.metadata || '');
