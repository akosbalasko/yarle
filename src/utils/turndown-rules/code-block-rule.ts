import { Rule } from 'turndown';

import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';

export const codeBlockRule = {
    filter: filterByNodeName('DIV'),
    replacement: (content: any, node: any) => {
        const nodeProxy = getAttributeProxy(node);
        if (nodeProxy.style && nodeProxy.style.value.indexOf('-en-codeblock:true')) {
            return "\n```\n" + content + "\n```\n";
        }

        return content;
    },
};
