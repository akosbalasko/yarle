import * as TurndownService from 'turndown';
import { gfm } from 'joplin-turndown-plugin-gfm';

import { wikiStyleLinksRule } from './turndown-rules/wikistyle-links-rule';
import { taskItemsRule } from './turndown-rules/task-items-rule';
import { spanRule } from './turndown-rules/span';
import { imagesRule } from './turndown-rules/images-rule';

export const getTurndownService = () => {
    /* istanbul ignore next */
    const turndownService = new TurndownService({
        br: '',
        blankReplacement: (content: any, node: any) => {
        return node.isBlock ? '\n\n' : '';
        },
        keepReplacement: (content: any, node: any) => {
        return node.isBlock ? `\n${node.outerHTML}\n` : node.outerHTML;
        },
        defaultReplacement: (content: any, node: any) => {
        return node.isBlock ? `\n${content}\n` : content;
        },
    });

    turndownService.addRule('evernote task items', taskItemsRule);
    turndownService.addRule('wikistyle links', wikiStyleLinksRule);
    turndownService.addRule('images', imagesRule);
    turndownService.addRule('span', spanRule);
    turndownService.use(gfm);

    return turndownService;
};
