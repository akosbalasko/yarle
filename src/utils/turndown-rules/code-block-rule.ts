import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';

const markdownBlock = '\n```\n';

const isCodeBlock = (node: any)  => {
    const nodeProxy = getAttributeProxy(node);
    const codeBlockFlag = '-en-codeblock:true';

    return nodeProxy.style && nodeProxy.style.value.indexOf(codeBlockFlag) >= 0;
};

export const codeBlockRule = {
    filter: filterByNodeName('DIV'),
    replacement: (content: string, node: any) => {
        const nodeProxy = getAttributeProxy(node);

        if (isCodeBlock(node)) {
            return `${markdownBlock}${content}${markdownBlock}`;
        }

        if (node.parentElement && isCodeBlock(node.parentElement) && node.parentElement.firstElementChild === node) {
            return `${content}`;
        }

        if (node.parentElement && isCodeBlock(node.parentElement)) {
            return `\n${content}`;
        }

        return node.isBlock ? `\n${content}\n` : content;
    },
};
