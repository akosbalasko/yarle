import * as TurndownService from 'turndown';
import { gfm } from 'joplin-turndown-plugin-gfm';

import { yarleOptions } from '../yarle';

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
    if (yarleOptions.wikiStyleMediaLinks) {
        turndownService.addRule('wikistyle links', {
            filter: (node: any) =>  {
                return node.nodeName === 'A';
            },
            replacement: (content: any, node: any) => {
                const handler = {
                    get(target: any, key: any): any {
                        return target[key];
                    },
                };
                const nodeProxy =  new Proxy(node.attributes, handler);
                if (nodeProxy.href) {
                    if (!nodeProxy.href.value.startsWith('http') && !nodeProxy.href.value.startsWith('www')) {
                        return `[[${node.innerHTML}]]`;
                    } else {
                        return `[${node.innerHTML}](${nodeProxy.href.value})`;
                    }
                }
            },
        });
    }
    turndownService.use(gfm);

    return turndownService;
};
