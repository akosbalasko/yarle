import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';

const mdCodeBlockFence = '\n```\n';
const codeBlockFlag = '-en-codeblock:true';

export const codeBlockRule = {
    filter: filterByNodeName('DIV'),
    replacement: (content: string, node: any) => {
        const nodeProxy = getAttributeProxy(node);

        if (nodeProxy.style && nodeProxy.style.value.indexOf(codeBlockFlag) >= 0) {
            return `${mdCodeBlockFence}${content}${mdCodeBlockFence}`;
        }

        return `\n${content}`;
    },
};
