import { applyTemplate } from './templates';
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

export interface NoteData {
  title?: string;
  tags?: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  location?: string;
}

export const processNode = (note: any): void => {
  const noteData: NoteData = { title: note.title };

  console.log(`Converting note ${noteData.title}...`);

  try {
    let content = getNoteContent(note);

    noteData.tags = yarleOptions.isMetadataNeeded ? logTags(note) : '';

    if (isComplex(note)) {
      content = processResources(note, content);
    }

    noteData.content = convertHtml2Md(content);

    const { createdAt, updatedAt, location } = getMetadata(note);

    noteData.createdAt = createdAt;
    noteData.updatedAt = updatedAt;
    noteData.location = location;

    const data = applyTemplate(noteData, yarleOptions);

    const absFilePath = isComplex(note)
      ? getComplexFilePath(note)
      : getSimpleFilePath(note);

    console.log('data =>\n', JSON.stringify(data), '\n***');

    writeMdFile(absFilePath, data, note);
  } catch (e) {
    console.log(`Failed to convert note: ${noteData.title}`, e);
  }
  console.log(`Note ${noteData.title} converted successfully.`);
};
