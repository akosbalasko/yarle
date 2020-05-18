import * as TurndownService from 'turndown';
import { gfm } from 'joplin-turndown-plugin-gfm';

export const getTurndownService = (): TurndownService => {
    /* istanbul ignore next */
    const turndownService = new TurndownService({
        br: '',
        blankReplacement: (content, node: any) => {
        return node.isBlock ? '\n\n' : '';
        },
        keepReplacement: (content, node: any) => {
        return node.isBlock ? `\n${node.outerHTML}\n` : node.outerHTML;
        },
        defaultReplacement: (content, node: any) => {
        return node.isBlock ? `\n${content}\n` : content;
        },
    });

    turndownService.addRule('EvernoteTaskItems', {
        filter: (node: any) =>  {
            return node.nodeName === 'EN-TODO';
        },
        replacement: (content: any, node: any) => {
            const handler = {
                get(target: any, key: any): any {
                    return target[key];
                },
            };
            const nodeProxy =  new Proxy(node.attributes, handler);

            return `${(nodeProxy.checked.value === 'true' ? '- [x]' : '- [ ]')} ${node.innerHTML}`;
        },
    });

    turndownService.use(gfm);

    return turndownService;
}