import { Rule } from 'turndown';

import { yarleOptions } from './../../yarle';
import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';

export const wikiStyleLinksRule = {
    filter: filterByNodeName('A'),
    replacement: (content: any, node: any) => {
        const nodeProxy = getAttributeProxy(node);
        if (nodeProxy.href) {
            return (
                (!nodeProxy.href.value.startsWith('http') && !nodeProxy.href.value.startsWith('www')) ||
                nodeProxy.href.value.startsWith('evernote://')) ?
                `[[${node.innerHTML}]]` :
                (yarleOptions.obsidianStyle) ?
                `![[${node.innerHTML}]]` :
                `[${node.innerHTML}](${nodeProxy.href.value})`;
        }
    },
};
