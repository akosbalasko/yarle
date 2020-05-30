
import { Rule } from 'turndown';

import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';
const EVERNOTE_HIGHLIGHT = '-evernote-highlight:true;';
const FONT_BOLD = 'font-weight:700';

export const spanRule: Rule = {
    filter: filterByNodeName('SPAN'),
    replacement: (content: any, node: any) => {
        const nodeProxy = getAttributeProxy(node);
        if (nodeProxy.style) {
            const nodeValue: string = nodeProxy.style.value;
            if(nodeValue.includes(EVERNOTE_HIGHLIGHT)) {
                content = `<span style="background-color:yellow">${content}</span>`
            }
            if(nodeValue.includes(FONT_BOLD)){
                content = ` **${content}**`
            }
            return content;
        }
    },
};

