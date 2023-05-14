
import { yarleOptions } from '../../yarle';
import { OutputFormat } from '../../output-format';

import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';
import { getLanguageItems } from './../../outputLanguages/outputLanguages';

const EVERNOTE_HIGHLIGHT = '-evernote-highlight:true;';
const EVERNOTE_COLORHIGHLIGHT = '--en-highlight';
const BOLD = 'bold';
const ITALIC = 'italic';

export const spanRule = {
    filter: filterByNodeName('SPAN'),
    replacement: (content: any, node: any) => {
        const languageItems = getLanguageItems(yarleOptions.outputFormat);
        //const HIGHLIGHT_SEPARATOR = yarleOptions.outputFormat === OutputFormat.ObsidianMD ? '==' : '`' ;
        const nodeProxy = getAttributeProxy(node);
        if (nodeProxy.style) {
            const nodeValue: string = nodeProxy.style.value;

            // this aims to care for bold text generated as <span style="font-weight: bold;">Bold</span>
            if (content !== '<YARLE_NEWLINE_PLACEHOLDER>') {
                const hasBold =  nodeValue.includes(BOLD);
                const hasItalic =  nodeValue.includes(ITALIC);
                if (hasBold && !hasItalic) { return `${languageItems.bold}${content}${languageItems.bold}`; }
                if (!hasBold && hasItalic) { return `${languageItems.italic}${content}${languageItems.italic}`; }
                if (hasBold && hasItalic) { return `${languageItems.italic}${languageItems.bold}${content}${languageItems.bold}${languageItems.italic}`; }
            }

            return nodeValue.includes(EVERNOTE_HIGHLIGHT) || nodeValue.includes(EVERNOTE_COLORHIGHLIGHT) ?
                `${languageItems.highlight}${content}${languageItems.highlight}` :
                content;
        }

        return content;
    },
};
