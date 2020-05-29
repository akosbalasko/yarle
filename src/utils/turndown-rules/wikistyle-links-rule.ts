import { Rule } from 'turndown';

import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';

export const wikiStyleLinksRule: Rule = {
    filter: filterByNodeName('A'),
    replacement: (content: any, node: any) => {
        const nodeProxy = getAttributeProxy(node);
        if (nodeProxy.href) {
            return (
                (!nodeProxy.href.value.startsWith('http') && !nodeProxy.href.value.startsWith('www')) ||
                nodeProxy.href.value.startsWith('evernote://')) ?
                `[[${node.innerHTML}]]` :
                `[${node.innerHTML}](${nodeProxy.href.value})`;
        }
    },
};
