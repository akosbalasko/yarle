
import { yarleOptions } from '../../yarle';
import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';
import { OutputFormat } from '../../output-format';

const EVERNOTE_HIGHLIGHT = '-evernote-highlight:true;';
const EVERNOTE_COLORHIGHLIGHT = '--en-highlight';
export const spanRule = {
    filter: filterByNodeName('SPAN'),
    replacement: (content: any, node: any) => {
        const HIGHLIGHT_SEPARATOR = yarleOptions.outputFormat === OutputFormat.ObsidianMD ? '==' : '`' ;
        const nodeProxy = getAttributeProxy(node);
        if (nodeProxy.style) {
            const nodeValue: string = nodeProxy.style.value;

            return nodeValue.includes(EVERNOTE_HIGHLIGHT) || nodeValue.includes(EVERNOTE_COLORHIGHLIGHT) ?
                `${HIGHLIGHT_SEPARATOR}${content}${HIGHLIGHT_SEPARATOR}` :
                content;
        }

        return content;
    },
};
