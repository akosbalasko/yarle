
import { Rule } from 'turndown';

import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';
const EVERNOTE_HIGHLIGHT = '-evernote-highlight:true;';

export const spanRule = {
    filter: filterByNodeName('SPAN'),
    replacement: (content: any, node: any) => {
        const nodeProxy = getAttributeProxy(node);
        if (nodeProxy.style) {
            const nodeValue: string = nodeProxy.style.value;

            return nodeValue.endsWith(EVERNOTE_HIGHLIGHT) ?
                `\`${content}\`` :
                content;
        }
    },
};
