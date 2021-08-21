import { JSDOM } from 'jsdom';
const {EOL} = require('os');

import { getTurndownService } from './utils/turndown-service';
import { NoteData } from './models/NoteData';
import { YarleOptions } from './YarleOptions';

const fixSublists = (node: HTMLElement) => {
    const ulElements: Array<HTMLElement> = Array.from(node.getElementsByTagName('ul'));
    const olElements: Array<HTMLElement> = Array.from(node.getElementsByTagName('ol'));
    const listElements = ulElements.concat(olElements);
    listElements.forEach(listNode => {
      if (listNode.parentElement.tagName === 'LI') {
        listNode.parentElement.replaceWith(listNode);
      }
      if (
        listNode.previousElementSibling &&
        listNode.previousElementSibling.tagName === 'LI'
      ) {
        // The below moves, not copies. https://stackoverflow.com/questions/7555442/move-an-element-to-another-parent-after-changing-its-id
        listNode.previousElementSibling.appendChild(listNode);
      }
    });

    // The contents of every EN list item are wrapped by a div element. `<li><div>foo</div></li>`
    // We need to remove this `<div>`, since it's a block element and will lead to unwanted whitespace otherwise
    const liElements: Array<HTMLElement> = Array.from(node.getElementsByTagName('li'));
    for (const liNode of liElements) {
      const listNodeDiv = liNode.firstElementChild;
      if (listNodeDiv && listNodeDiv.tagName === 'DIV') {
        const childElementsArr = Array.from(listNodeDiv.childNodes);
        listNodeDiv.replaceWith(...childElementsArr);
      }
    };

    return node;
};

export const convertHtml2Md = (yarleOptions: YarleOptions, { htmlContent }: NoteData): NoteData => {
    let content = htmlContent.replace(/<!DOCTYPE en-note [^>]*>/, '<!DOCTYPE html>')
      .replace(/(<a [^>]*)\/>/, '$1></a>');
    

    content = content.replace(/<div[^\/\<]*\/>/g, '');  
 
    const contentNode = new JSDOM(content).window.document
      .getElementsByTagName('en-note').item(0) as any as HTMLElement;

    const contentNode2 =fixSublists(contentNode);

    let contentInMd = getTurndownService(yarleOptions).turndown(contentNode2);

    const newLinePlaceholder = new RegExp('<YARLE_NEWLINE_PLACEHOLDER>', 'g');
    contentInMd = contentInMd.replace(newLinePlaceholder,'');

    if(yarleOptions.logseqMode){
      //add a "- " at each new line
      //contentInMd = contentInMd.split('\n').join('\n- ');
 
      contentInMd = contentInMd.replace(/\n/g,'\n- ');
 
      contentInMd = contentInMd.replace(/\r/g,'\n');

      contentInMd = contentInMd.replace(/<br>/g,'[:br]');//fix new line in table

      contentInMd = contentInMd.replace(/- \|/g,' |');//fix table problem

      contentInMd = contentInMd.replace(/- __\n/g,'- \n');//fix empty bold/italic
      contentInMd = contentInMd.replace(/- \*\*\*\*\n/g,'- \n');//fix empty bold/italic
      contentInMd = contentInMd.replace(/- _\*\*\*\*_\n/g,'- \n');//fix empty bold/italic
      contentInMd = contentInMd.replace(/- \*\*__\*\*\n/g,'- \n');//fix empty bold/italic
      
      
      contentInMd = '- '+contentInMd;
    }

    return contentInMd && contentInMd !== 'undefined' ? { content: contentInMd } : {content: ''};
};
