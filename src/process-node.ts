import { applyTemplate } from './templates';
import {
  getComplexFilePath,
  getMetadata,
  getNoteContent,
  getSimpleFilePath,
  getTags,
  isComplex,
} from './utils';
import { yarleOptions } from './yarle';
import { writeMdFile } from './utils/file-utils';
import { processResources } from './process-resources';
import { convertHtml2Md } from './convert-html-to-md';
import { NoteData } from './models/NoteData';

export const processNode = (note: any): void => {
  let noteData: NoteData = { title: note.title };

  console.log(`Converting note ${noteData.title}...`);

  try {
    let content = getNoteContent(note);

    if (isComplex(note)) {
      content = processResources(note, content);
    }

    noteData = {...noteData, ...convertHtml2Md(content)};
    noteData = {...noteData, ...getMetadata(note)};
    noteData = {...noteData, ...getTags(note)};

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
