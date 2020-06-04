import { Rule } from 'turndown';

import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';

export const taskItemsRule = {
    filter: filterByNodeName('EN-TODO'),
    replacement: (content: any, node: any) => {
        const nodeProxy = getAttributeProxy(node);

        return `${(nodeProxy.checked.value === 'true' ? '- [x]' : '- [ ]')} ${node.innerHTML}`;
    },
};
