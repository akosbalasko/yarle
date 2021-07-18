import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';

const markdownBlock = '\n```\n';

const isCodeBlock = (node: any)  => {
    const nodeProxy = getAttributeProxy(node);
    const codeBlockFlag = '-en-codeblock:true';

    return nodeProxy.style && nodeProxy.style.value.indexOf(codeBlockFlag) >= 0;
};

const getIntendNumber = (node: any): number => {
    const nodeProxy = getAttributeProxy(node);
    const paddingAttr = 'padding-left:';
    let intendNumber = 0;
    if (nodeProxy.style && nodeProxy.style.value.indexOf(paddingAttr) >= 0){
        intendNumber = Math.floor(nodeProxy.style.value.split(paddingAttr)[1].split('px')[0] / 20);
    }
    return intendNumber;
}

export const unescapeMarkdown = (s: string): string => s.replace(/\\(.)/g, '$1');

export const codeBlockRule = {
    filter: filterByNodeName('DIV'),
    replacement: (content: string, node: any) => {
        const nodeProxy = getAttributeProxy(node);
        const intend = getIntendNumber(node);
        content = `${'\t'.repeat(intend)}${content}`; 
        if (isCodeBlock(node)) {
            // turndown has already escaped markdown chars (and all '\') in content;
            // reverse that to avoid extraneous backslashes in code block.
            content = unescapeMarkdown(content);
            return `${markdownBlock}${content}${markdownBlock}`;
        }

        if (node.parentElement && isCodeBlock(node.parentElement) && node.parentElement.firstElementChild === node) {
            return `${content}`;
        }

        if (node.parentElement && isCodeBlock(node.parentElement)) {
            return `\n${content}`;
        }
        const childHtml = node.innerHTML;
        /*return node.isBlock 
            ? childHtml !== '<br>'
                ? `\n${content}\n`
                : `${content}`
            : `${content}`;
        */

        return node.isBlock ? `\n${content}\n` : content;
    },
};
