import { JSDOM } from 'jsdom';

import { getTurndownService } from './utils/turndown-service';
import { NoteData } from './models/NoteData';
import { yarleOptions } from './yarle';

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
    liElements.forEach(liNode => {
      const listNodeDiv = liNode.firstElementChild;
      if (listNodeDiv && listNodeDiv.tagName === 'DIV') {
        const childElementsArr = Array.from(listNodeDiv.childNodes);
        listNodeDiv.replaceWith(...childElementsArr);
      }
    });

    return node;
};

export const convertHtml2Md = ({ htmlContent }: NoteData): NoteData => {
    const content = htmlContent.replace(/<!DOCTYPE en-note [^>]*>/, '<!DOCTYPE html>')
      .replace(/(<a [^>]*)\/>/, '$1></a>');
    const contentNode = new JSDOM(content).window.document
      .getElementsByTagName('en-note').item(0) as any as HTMLElement;
    const contentInMd = getTurndownService(yarleOptions).turndown(fixSublists(contentNode));

    return contentInMd && contentInMd !== 'undefined' ? { content: contentInMd } : {content: ''};
};
