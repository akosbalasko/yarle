import { EOL } from 'os';

import { applyTemplate } from './utils/templates/templates';
import {
  getMetadata,
  getTags,
  hasResource,
  saveHtmlFile,
  saveMdFile,
} from './utils';
import { yarleOptions } from './yarle';
import { prepareContentByExtractingDataUrlResources, processResources } from './process-resources';
import { convertHtml2MdContent } from './convert-html-to-md';
import { convert2Html } from './convert-to-html';
import { EvernoteNoteData, NoteData } from './models/NoteData';
import { loggerInfo } from './utils/loggerInfo';
import { RuntimePropertiesSingleton } from './runtime-properties';
import { LanguageFactory } from './outputLanguages/LanguageFactory';
import { performRegexpOnTitle } from './utils/get-title';

export const processNode = (pureNote: EvernoteNoteData, notebookName: string): void => {

  const dateStarted: Date = new Date();
  loggerInfo(EOL);
  loggerInfo(`Conversion started at ${dateStarted}`);

  const runtimeProps = RuntimePropertiesSingleton.getInstance();
  runtimeProps.setCurrentNoteName(pureNote.title);


  let noteData: NoteData = {
    created: pureNote.created,
    title: performRegexpOnTitle(yarleOptions, pureNote.title),
    noteName: pureNote.title,
    content: Array.isArray(pureNote.content) ? pureNote.content.join('') : pureNote.content,
    originalContent: pureNote.content,
  };

  // tslint:disable-next-line:no-console
  loggerInfo(`Converting note "${noteData.title}"...`);

  try {
    let htmlContent = noteData.content; 
    if (hasResource(pureNote)) {
      htmlContent = processResources(pureNote);
    }
    htmlContent = prepareContentByExtractingDataUrlResources(pureNote, htmlContent);

    noteData.markdownContent = convertHtml2MdContent(yarleOptions, htmlContent);
    noteData = {...noteData, ...getMetadata(pureNote, notebookName)};
    noteData.tags = getTags(pureNote);

    noteData.appliedMarkdownContent = applyTemplate(noteData, yarleOptions);
    // tslint:disable-next-line:no-console
    // loggerInfo(`data =>\n ${JSON.stringify(data)} \n***`);
    const langaugeFactory = new LanguageFactory();
    const targetLanguage = langaugeFactory.createLanguage(yarleOptions.outputFormat)

    targetLanguage.noteProcess(yarleOptions, noteData, pureNote)

    if (yarleOptions.keepOriginalHtml) {
      convert2Html(noteData);
      saveHtmlFile(noteData, pureNote);
    }

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
