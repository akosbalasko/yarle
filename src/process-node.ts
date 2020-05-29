import { getComplexFilePath, getMetadata, getNoteContent, getNoteTitle, getSimpleFilePath, isComplex, logTags } from './utils';
import { yarleOptions } from './yarle';
import { writeMdFile } from './utils/file-utils';
import { processResources } from './process-resources';
import { convertHtml2Md } from './convert-html-to-md';

export const processNode = (note: any): void => {
    let data = '';
    let content = getNoteContent(note);
    const absFilePath = isComplex(note) ?
      getComplexFilePath(note) :
      getSimpleFilePath(note);

    data = data.concat(getNoteTitle(note));
    if (yarleOptions.isMetadataNeeded) {
      data = data.concat(logTags(note));
    }
    if (isComplex(note)) {
      content = processResources(note, content);
    }

    const markdown = convertHtml2Md(content);

    data = data.concat(markdown);
    if (yarleOptions.isMetadataNeeded) {
      const metadata = getMetadata(note);
      data = data.concat(metadata);
    }
    writeMdFile(absFilePath, data, note);

  };
