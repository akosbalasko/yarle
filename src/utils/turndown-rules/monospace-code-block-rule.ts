import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';
import { unescapeMarkdown } from './code-block-rule';

const markdownBlock = '\n```\n';

const codeBlockFlag = '-en-codeblock:true';
const reMonospaceFont =
    /\b(Courier|Mono|Consolas|Console|Inconsolata|Pitch|Monaco|monospace)\b/;

const deepestFont: (node: any) => string = node => {
    if (node.nodeType !== 1) {
        return null;
    }
    const children = node.childNodes;
    const numChildren = children.length;
    if (numChildren > 1) {
        return 'mixed';
    }
    if (numChildren === 1) {
        const font = deepestFont(children[0]);
        if (font) {
            return font;
        }
    }
    const nodeProxy = getAttributeProxy(node);
    if (node.tagName === 'FONT') {
        return nodeProxy.face?.value;
    }
    const style = nodeProxy.style?.value;
    if (style) {
        const match = style.match(/font-family:([^;]+)/);
        if (match) {
            return match[1];
        }
    }

    return null;
};

const isCodeBlock: (node: any) => boolean = node => {
    const nodeProxy = getAttributeProxy(node);
    const style = nodeProxy.style?.value;
    if (style && style.includes(codeBlockFlag)) {
        return true;
    }

    const font = deepestFont(node);

    return font && reMonospaceFont.test(font);
};

export const monospaceCodeBlockRule = {
    filter: filterByNodeName('DIV'),
    replacement: (content: string, node: any) => {
        if (isCodeBlock(node)) {
            const previous = node.previousSibling;
            const previousIsBlock = previous && previous.tagName === node.tagName && isCodeBlock(previous);
            const next = node.nextSibling;
            const nextIsBlock = next && next.tagName === node.tagName && isCodeBlock(next);
            if (previousIsBlock || nextIsBlock) {
                content = previousIsBlock ? `\n${content}` : `${markdownBlock}${content}`;
                content = nextIsBlock ? `${content}\n` : `${content}${markdownBlock}`;

                return content;
            }

            content = unescapeMarkdown(content);
            return content.trim() ? `${markdownBlock}${content}${markdownBlock}` : content;
        }

        if (node.parentElement && isCodeBlock(node.parentElement) && node.parentElement.firstElementChild === node) {
            return content;
        }

        if (node.parentElement && isCodeBlock(node.parentElement)) {
            return `\n${content}`;
        }

        return node.isBlock ? `\n${content}\n` : content;
    },
};
