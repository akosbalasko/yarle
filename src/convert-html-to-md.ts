import { JSDOM } from 'jsdom';

import { getTurndownService } from './utils/turndown-service';

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
        listNodeDiv.replaceWith(listNodeDiv.innerHTML);
      }
    });

    return node;
};

export const convertHtml2Md = (content: string) => {
    const contentNode = new JSDOM(`<x-turndown id="turndown-root">${content}</x-turndown>`).window.document.getElementById('turndown-root');
    const contentInMd = getTurndownService().turndown(fixSublists(contentNode));

    return contentInMd && contentInMd !== 'undefined' ? contentInMd : '';
};
