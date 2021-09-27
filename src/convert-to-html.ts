import { yarleOptions } from './yarle';
import { NoteData } from './models/NoteData';
import { generateHtmlContent } from './utils';

const fontFamily = 'Arial,"Helvetica Neue",Helvetica,sans-serif';
const fontSize = '12pt';

export const convert2Html = (noteData: NoteData): void => {

  const m = noteData.originalContent.match(/<en-note(| [^>]*)>([\s\S]*)<\/en-note>/);
  if (!m) {
    return null;
  }
  /* noteData.htmlContent = `<div${m[1]}>${m[2]}</div>`;
  noteData.htmlContent = noteData.htmlContent.replace(/<(a href|img src)=".\/_resources\//, '<$1="./')
  */

  noteData.htmlContent = `<div${m[1]}>${noteData.htmlContent.replace(/<(a href|img src)=".\/_resources\//g, '<$1="./')}</div>`;

  let url = noteData.sourceUrl;
  if (url) {
    url = `<a href="${url}">${url.replace('&', '&amp;')}</a>`;
  }
  let tags = noteData.tags;
  if (tags) {
      tags = tags.split(' ').join(', ');
  }
  const trs = [
    ['Created', noteData.createdAt],
    ['Updated', noteData.updatedAt],
    ['Location', noteData.location],
    ['Source', url],
    ['Tags', tags],
  ].filter(r => r[1])
    .reduce((p, c) => `${p}\n<tr><th>${c[0]}:</th><td>${c[1]}</td></tr>`, '');

  noteData.htmlContent = generateHtmlContent({title: noteData.title, content: noteData.htmlContent, fontFamily, fontSize, metaTable: trs});
  };
