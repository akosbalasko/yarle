import { Rule } from 'turndown';

import { OutputFormat } from './../../output-format';
import { yarleOptions } from './../../yarle';
import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';

export const removeBrackets = (str: string): string => {
    return str.replace(/\[|\]/g,'');
}
export const wikiStyleLinksRule = {
    filter: filterByNodeName('A'),
    replacement: (content: any, node: any) => {
        const nodeProxy = getAttributeProxy(node);
        if (nodeProxy.href) {
            return (
                (!nodeProxy.href.value.startsWith('http') && !nodeProxy.href.value.startsWith('www')) ||
                nodeProxy.href.value.startsWith('evernote://')) ?
                `[[${removeBrackets(node.innerHTML)}]]` :
                (yarleOptions.outputFormat === OutputFormat.ObsidianMD) ?
                `![[${removeBrackets(node.innerHTML)}]]` :
                `[${removeBrackets(node.innerHTML)}](${nodeProxy.href.value})`;
        }
    },
};
