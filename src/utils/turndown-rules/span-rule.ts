
import { yarleOptions } from '../../yarle';
import { OutputFormat } from '../../output-format';

import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';

const EVERNOTE_HIGHLIGHT = '-evernote-highlight:true;';
const EVERNOTE_COLORHIGHLIGHT = '--en-highlight';
const BOLD = 'bold';
const ITALIC = 'italic';
export const spanRule = {
    filter: filterByNodeName('SPAN'),
    replacement: (content: any, node: any) => {
        const HIGHLIGHT_SEPARATOR = yarleOptions.outputFormat === OutputFormat.ObsidianMD ? '==' : '`' ;
        const nodeProxy = getAttributeProxy(node);
        if (nodeProxy.style) {
            const nodeValue: string = nodeProxy.style.value;

            if (yarleOptions.outputFormat === OutputFormat.LogSeqMD) {
                // this aims to care for bold text generated as <span style="font-weight: bold;">Bold</span>
                if (content !== '<YARLE_NEWLINE_PLACEHOLDER>') {
                    const hasBold =  nodeValue.includes(BOLD);
                    const hasItalic =  nodeValue.includes(ITALIC);
                    if (hasBold && !hasItalic) { return `**${content}**`; }
                    if (!hasBold && hasItalic) { return `_${content}_`; }
                    if (hasBold && hasItalic) { return `_**${content}**_`; }
                }
            }

            return nodeValue.includes(EVERNOTE_HIGHLIGHT) || nodeValue.includes(EVERNOTE_COLORHIGHLIGHT) ?
                `${HIGHLIGHT_SEPARATOR}${content}${HIGHLIGHT_SEPARATOR}` :
                content;
        }

        return content;
    },
};
