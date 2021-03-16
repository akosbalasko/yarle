import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';
import { yarleOptions } from '../../yarle';

export const newLineRule = {
    filter: filterByNodeName('BR'),
    replacement: (content: any, node: any) => {
        const nodeProxy = getAttributeProxy(node);

        return '<YARLE_NEWLINE_PLACEHOLDER>';
    },
};
