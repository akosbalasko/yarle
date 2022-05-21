import { OutputFormat } from '../../output-format';
import { yarleOptions } from '../../yarle';

import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';

export const taskListRule = {
    filter: 'li',
    replacement: (content: any, node: any, options: any) => {
        const indentCount  = content.match(/^\n*/)[0].length || 0;

        const singleLineContent = content
            .replace(/^\n+/, '') // Remove leading newlines
            .replace(/\n+$/, '\n') // Replace trailing newlines with just a single one
            .replace(/\n/gm, '\n  '); // Indent
        const indentChars = '  '.repeat(indentCount);

        let prefix =  indentCount > 0 ?  indentChars : '* ';
        const parent = node.parentNode;
        if (parent.nodeName === 'OL') {
            const start = parent.getAttribute('start');
            const index = Array.prototype.indexOf.call(parent.children, node);
            prefix = `${(start ? Number(start) + index : index + 1)}. `;
        }

        let ret;

        ret = (prefix + singleLineContent + (node.nextSibling && !/\n$/.test(singleLineContent) ? '\n' : ''));

        return ret;
}};
