import { Rule } from 'turndown';

import { yarleOptions } from '../../yarle';

import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';

export const imagesRule = {
    filter: filterByNodeName('IMG'),
    replacement: (content: any, node: any) => {
        const nodeProxy = getAttributeProxy(node);

        if (yarleOptions.obsidianStyle){
           return `![[${nodeProxy.src.value}]]`;
        }
        const srcSpl = nodeProxy.src.value.split('/');

        return `![${srcSpl[srcSpl.length - 1]}](${nodeProxy.src.value})`;
    },
};
