import { yarleOptions } from './yarle';
import { NoteData } from './models/NoteData';

const fontFamily = 'Arial,"Helvetica Neue",Helvetica,sans-serif';
const fontSize = '12pt';

export const convert2Html = (content: string, noteData: NoteData): string => {
  if (!yarleOptions.keepOriginalHtml) {
    return null;
  }
  const m = content.match(/<en-note(| [^>]*)>([\s\S]*)<\/en-note>/);
  if (!m) {
    return null;
  }
  content = `<div${m[1]}>${m[2]}</div>`;
  content = content.replace(/<(a href|img src)=".\/_resources\//, '<$1="./')
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

  return `<!DOCTYPE html>
<head>
<title>${noteData.title}</title>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />

<style>
body {
padding: 1em;
color: #080808;
background-color: #f8f8f8;
}
body, td, th {
font-family: ${fontFamily};
font-size: ${fontSize};
}
table.meta {
margin-bottom: 3em;
border-collapse: collapse;
}
table.meta th {
text-align: left;
}
table.meta th, table.meta td {
padding: 2pt 4pt;
background-color: #D4DDE5;
border: 1px solid #444444;
font-size: 10pt;
}
</style>
</head>
<body>
<h1>${noteData.title}</h1>
<div>
<table class="meta">${trs}
</table>
${content}
</body>
</html>`;
  }