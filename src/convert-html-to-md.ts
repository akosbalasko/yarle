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

    return node;
};

export const convertHtml2Md = (content: string) => {
    const contentNode = new JSDOM(`<x-turndown id="turndown-root">${content}</x-turndown>`).window.document.getElementById('turndown-root');
    const contentInMd = getTurndownService().turndown(fixSublists(contentNode));

    return contentInMd && contentInMd !== 'undefined' ? contentInMd : '';
};
