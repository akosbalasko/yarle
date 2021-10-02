import { OutputFormat } from './../../output-format';

import { yarleOptions } from '../../yarle';

import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';

export const taskItemsRule = {
    filter: filterByNodeName('EN-TODO'),
    replacement: (content: any, node: any) => {
        const nodeProxy = getAttributeProxy(node);

        // If <EN-TODO> is already in <LI> (it always is in newer Evernote builds),
        // don't add an extra list bullet
        const prefix = yarleOptions.outputFormat === OutputFormat.LogSeqMD ? '' :
            node.parentElement?.nodeName?.toUpperCase() === 'LI' ? '' : '- ';

        return `${prefix}${(nodeProxy.checked.value === 'true' ? '[x]' : '[ ]')} ${content}`;
    },
};
