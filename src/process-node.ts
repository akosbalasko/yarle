import { EOL } from 'os';

import { applyTemplate } from './utils/templates/templates';
import {
  getMetadata,
  getTags,
  isComplex,
  saveHtmlFile,
  saveMdFile,
} from './utils';
import { yarleOptions } from './yarle';
import { extractDataUrlResources, processResources } from './process-resources';
import { convertHtml2Md } from './convert-html-to-md';
import { convert2Html } from './convert-to-html';
import { NoteData } from './models/NoteData';
import { loggerInfo } from './utils/loggerInfo';
import { isTOC } from './utils/is-toc';
import { RuntimePropertiesSingleton } from './runtime-properties';
import { OutputFormat } from './output-format';
import { convert2TanaNode } from './utils/tana/convert-to-tana-node';
import { saveTanaFile } from './utils/save-tana-file';
import { isTanaOutput } from './utils/tana/is-tana-output';

export const processNode = (note: any, notebookName: string): void => {

  const dateStarted: Date = new Date();
  loggerInfo(EOL);
  loggerInfo(`Conversion started at ${dateStarted}`);

  const runtimeProps = RuntimePropertiesSingleton.getInstance();
  runtimeProps.setCurrentNoteName(note.title);

  if (Array.isArray(note.content)) {
    note.content = note.content.join('');
  }
  let noteData: NoteData = {
    title: note.title,
    content: note.content,
    htmlContent: note.content,
    originalContent: note.content,
  };

  // tslint:disable-next-line:no-console
  loggerInfo(`Converting note "${noteData.title}"...`);

  try {
    if (isComplex(note)) {
      noteData.htmlContent = processResources(note);
    }
    noteData.htmlContent = extractDataUrlResources(note, noteData.htmlContent);

    noteData = {...noteData, ...convertHtml2Md(yarleOptions, noteData)};
    noteData = {...noteData, ...getMetadata(note, notebookName)};
    noteData = {...noteData, ...getTags(note)};

    const data = applyTemplate(noteData, yarleOptions);
    // tslint:disable-next-line:no-console
    // loggerInfo(`data =>\n ${JSON.stringify(data)} \n***`);

    if (isTanaOutput()){
      const tanaJson = convert2TanaNode(noteData, yarleOptions)
      saveTanaFile(tanaJson, note)
    }
    else saveMdFile(data, note);

    if (yarleOptions.keepOriginalHtml) {
      convert2Html(noteData);
      saveHtmlFile(noteData, note);
    }

    /* if (isTOC(noteData.title)) {
      const  noteIdNameMap = RuntimePropertiesSingleton.getInstance();
      noteIdNameMap.extendNoteIdNameMap(noteData);
    }*/

  } catch (e) {
    // tslint:disable-next-line:no-console
    loggerInfo(`Failed to convert note: ${noteData.title}, ${JSON.stringify(e)}`);
  }
  // tslint:disable-next-line:no-console
  const dateFinished: Date = new Date();
  const conversionDuration = (dateFinished.getTime() - dateStarted.getTime()) / 1000; // in seconds.
  loggerInfo(`Conversion finished at ${dateFinished}`);
  loggerInfo(`Note "${noteData.title}" converted successfully in ${conversionDuration} seconds.`);

};
