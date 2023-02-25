import { yarleOptions } from './../../yarle';
import { replaceCodeBlock } from './replace-code-block';
import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';
import { replaceMonospaceCodeBlock } from './replace-monospace-code-block';

const markdownBlock = '\n```\n';

const isTaskBlock = (node: any)  => {
    const nodeProxy = getAttributeProxy(node);
    const taskFlag = '--en-task-group:true';

    return nodeProxy.style && nodeProxy.style.value.indexOf(taskFlag) >= 0;
};
const getTaskGroupId = (node: any) => {
    const nodeProxy = getAttributeProxy(node);
    const idAttr = '--en-id:';

    return nodeProxy.style.value.split(idAttr)[1].split(';')[0];
};

export const divRule = {
    filter: filterByNodeName('DIV'),
    replacement: (content: string, node: any) => {
        const nodeProxy = getAttributeProxy(node);

        return (isTaskBlock(node))
            ? `<YARLE-EN-V10-TASK>${getTaskGroupId(node)}</YARLE-EN-V10-TASK>`
            : (yarleOptions.monospaceIsCodeBlock)
                ? replaceMonospaceCodeBlock(content, node)
                : replaceCodeBlock(content, node);
    },
};
