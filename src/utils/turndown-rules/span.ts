
import { Rule } from 'turndown';

import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';
const EVERNOTE_HIGHLIGHT = '-evernote-highlight:true;';
const FONT_WEIGHT_BOLD_NUMBER = 'font-weight:700';
const FONT_WEIGHT_BOLD_KEYWORD = 'font-weight:bold';

export const spanRule: Rule = {
    filter: filterByNodeName('SPAN'),
    replacement: (content: any, node: any) => {
        const nodeProxy = getAttributeProxy(node);
        if (nodeProxy.style) {
            const nodeValue: string = nodeProxy.style.value;

            return nodeValue.includes(EVERNOTE_HIGHLIGHT) ?
                `\`${content}\`` :
                ((nodeValue.includes(FONT_WEIGHT_BOLD_NUMBER) || nodeValue.includes(FONT_WEIGHT_BOLD_KEYWORD)) ?
                 ` **${content}**` :
                content);
        }

        return content;
    },
};