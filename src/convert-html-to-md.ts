import { JSDOM } from 'jsdom';

import { getTurndownService } from './utils/turndown-service';
import { NoteData } from './models/NoteData';
import { YarleOptions } from './YarleOptions';
import { OutputFormat } from './output-format';

const unwrapElement = (node: Element) => {
    node.replaceWith(...Array.from(node.children));
};

const swapParent = (wrapper: Element) => {
    const inner = wrapper.parentElement;
    inner.replaceWith(...Array.from(inner.childNodes));
    inner.append(...Array.from(wrapper.childNodes));
    wrapper.appendChild(inner);
};

const fixTasks = (node: HTMLElement) => {
    // fix bold or italic breaking a task's syntax
    // i.e. '*[] foo*' instead of '[] *foo*'
    const spanTasks = Array.from(node.querySelectorAll('span>en-todo'));
    spanTasks.forEach(swapParent);
    // fix an anchor breaking a task's syntax
    // i.e. '[] [foo](bar)' instead of '[[] foo](bar)'
    const anchorTasks = Array.from(node.querySelectorAll('a>en-todo'));
    anchorTasks.forEach(swapParent);

    return node;
};
const fixSublistsInContent = (content: string): string => {
    let cont = content.replace(/<li>/g, '<li><div>');
    cont = cont.replace(/<\/li>/g, '</div></li>');
    cont = cont.replace(/<li><div>(\s)*<div>/g, '<li><div>');
    cont = cont.replace(/<\/div>(\s)*<\/div><\/li>/g, '</div></li>');

    return cont;
};

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
            // The below moves, not copies.
            // https://stackoverflow.com/questions/7555442/move-an-element-to-another-parent-after-changing-its-id
            listNode.previousElementSibling.appendChild(listNode);
        }
    });

    for (const n of listElements) {
        const parentElement = n.parentElement;
        if (parentElement?.tagName === 'DIV' &&
            parentElement?.parentElement?.tagName === 'UL') {
            unwrapElement(parentElement);
        }
        // remove nested lists whose only child is another list, i.e. <ul><ul>...</ul></ul>
        if ((parentElement?.tagName === 'UL' || parentElement?.tagName === 'OL')
            && parentElement?.childNodes.length === 1) {
            unwrapElement(parentElement);
        }
    }

    // The contents of every EN list item are wrapped by a div element. `<li><div>foo</div></li>`
    // We need to remove this `<div>`, since it's a block element and will lead to unwanted whitespace otherwise
    const liElements: Array<HTMLElement> = Array.from(node.getElementsByTagName('li'));
    for (const liNode of liElements) {
        const listNodeDiv = liNode.firstElementChild;
        if (listNodeDiv && listNodeDiv.tagName === 'DIV') {
            const childElementsArr = Array.from(listNodeDiv.childNodes);
            listNodeDiv.replaceWith(...childElementsArr);
        }
    }

    return node;
};

export const convertHtml2Md = (yarleOptions: YarleOptions, { htmlContent }: NoteData): NoteData => {

    const content = htmlContent.replace(/<!DOCTYPE en-note [^>]*>/, '<!DOCTYPE html>')
      .replace(/(<a [^>]*)\/>/, '$1></a>').replace(/<div[^\/\<]*\/>/g, '');

    const contentNode = new JSDOM(fixSublistsInContent(content)).window.document
      .getElementsByTagName('en-note').item(0) as any as HTMLElement;

    let contentInMd = getTurndownService(yarleOptions)
        .turndown(fixTasks(fixSublists(contentNode)));

    const newLinePlaceholder = new RegExp('<YARLE_NEWLINE_PLACEHOLDER>', 'g');
    contentInMd = contentInMd.replace(newLinePlaceholder, yarleOptions.convertPlainHtmlNewlines ? '\n': '');

    if (yarleOptions.outputFormat === OutputFormat.LogSeqMD) {

      contentInMd = contentInMd.replace(/\n/g, '\n- ') // add a "- " at each new line
      // .replace(/\r/g, '\n')
      .replace(/<br>/g, '[:br]')// fix new line in table
      .replace(/- \|/g, ' |')// fix table problem
      .replace(/- __\n/g, '- \n')// fix empty bold/italic
      .replace(/- \*\*\*\*\n/g, '- \n')
      .replace(/- _\*\*\*\*_\n/g, '- \n')
      .replace(/- \*\*__\*\*\n/g, '- \n');

      contentInMd = `- ${contentInMd}`; // the first line

    }

    return contentInMd && contentInMd !== 'undefined' ? { content: contentInMd } : {content: ''};
};
