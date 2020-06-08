
import { Rule } from 'turndown';

import { yarleOptions } from './../../yarle';
import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';
const EVERNOTE_HIGHLIGHT = '-evernote-highlight:true;';

export const spanRule = {
    filter: filterByNodeName('SPAN'),
    replacement: (content: any, node: any) => {
        const HIGHLIGHT_SEPARATOR = yarleOptions.obsidianStyle ? '==' : '`' ;
        const nodeProxy = getAttributeProxy(node);
        if (nodeProxy.style) {
            const nodeValue: string = nodeProxy.style.value;

            return nodeValue.endsWith(EVERNOTE_HIGHLIGHT) ?
                `${HIGHLIGHT_SEPARATOR}${content}${HIGHLIGHT_SEPARATOR}` :
                content;
        }
    },
};
