import { getComplexFilePath, getMetadata, getNoteContent, getSimpleFilePath, getTitle, isComplex, logTags } from './utils';
import { yarleOptions } from './yarle';
import { writeMdFile } from './utils/file-utils';
import { processResources } from './process-resources';
import { convertHtml2Md } from './convert-html-to-md';

export const processNode = (note: any): void => {
  const title = getTitle(note);
  console.log(`Converting note ${title}...`);

  try {
    let data = '';
    let content = getNoteContent(note);
    const absFilePath = isComplex(note) ?
      getComplexFilePath(note) :
      getSimpleFilePath(note);

    data = data.concat(title);
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
  } catch (e) {
    console.log(`Failed to convert note: ${title}`, e);
  }
  console.log(`Note ${title} converted successfully.`);

  };
