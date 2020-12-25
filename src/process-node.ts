import { applyTemplate } from './utils/templates/templates';
import {
  getHtmlFilePath,
  getMdFilePath,
  getMetadata,
  getNoteContent,
  getTags,
  isComplex,
} from './utils';
import { yarleOptions } from './yarle';
import { writeFile } from './utils/file-utils';
import { processResources } from './process-resources';
import { convertHtml2Md } from './convert-html-to-md';
import { convert2Html } from './convert-to-html';
import { NoteData } from './models/NoteData';

export const processNode = (note: any, notebookName: string): void => {
  let noteData: NoteData = { title: note.title };

  // tslint:disable-next-line:no-console
  console.log(`Converting note ${noteData.title}...`);

  try {
    let content = getNoteContent(note);

    if (isComplex(note)) {
      content = processResources(note, content);
    }

    noteData = {...noteData, ...convertHtml2Md(content)};
    noteData = {...noteData, ...getMetadata(note, notebookName)};
    noteData = {...noteData, ...getTags(note)};

    let data = applyTemplate(noteData, yarleOptions);
    let absFilePath = getMdFilePath(note);

    // tslint:disable-next-line:no-console
    console.log('data =>\n', JSON.stringify(data), '\n***');

    writeFile(absFilePath, data, note);

    data = convert2Html(content, noteData);
    if (data) {
        absFilePath = getHtmlFilePath(note);
        writeFile(absFilePath, data, note);
    }

  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log(`Failed to convert note: ${noteData.title}`, e);
  }
  // tslint:disable-next-line:no-console
  console.log(`Note ${noteData.title} converted successfully.`);
};
