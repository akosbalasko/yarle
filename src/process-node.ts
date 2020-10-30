
import { getComplexFilePath, getMetadata, getNoteContent, getSimpleFilePath, getTitle, isComplex, logNotebookName, logTags, logSingleSeparator, logSectionSeparator } from './utils';
import { yarleOptions } from './yarle';
import { writeMdFile } from './utils/file-utils';
import { processResources } from './process-resources';
import { convertHtml2Md } from './convert-html-to-md';

export const processNode = (note: any, notebookName: string): void => {
    const title = getTitle(note);
    // tslint:disable-next-line: no-console
    console.log(`Converting note ${title}...`);
    try {
      let data = '';
      let content = getNoteContent(note);
      const absFilePath = isComplex(note) ?
        getComplexFilePath(note) :
        getSimpleFilePath(note);
        
      const logTopMetadataSection = yarleOptions.isMetadataNeeded && 
        (yarleOptions.isNotebookNameNeeded || (!yarleOptions.skipTags && note.tag))
        
      data += title;
      if (logTopMetadataSection) {
        data += logSectionSeparator();
        if (yarleOptions.isNotebookNameNeeded) {
          data += logNotebookName(notebookName);
        }
        data += logTags(note);
        data += logSectionSeparator();
        data += logSingleSeparator();
      }
      if (isComplex(note)) {
        content = processResources(note, content);
      }

      const markdown = convertHtml2Md(content);

      data += markdown;
      if (yarleOptions.isMetadataNeeded) {
        const metadata = getMetadata(note);
        data += metadata;
      }
      writeMdFile(absFilePath, data, note);
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log(`Failed to convert note: ${title}`, e);
    }
    // tslint:disable-next-line: no-console
    console.log(`Note ${title} converted successfully.`);
    };
