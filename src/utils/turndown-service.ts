import TurndownService from 'turndown';
import { gfm } from 'joplin-turndown-plugin-gfm';
import { YarleOptions } from './../YarleOptions';

import { monospaceCodeBlockRule, codeBlockRule, imagesRule, spanRule, taskItemsRule, wikiStyleLinksRule } from './turndown-rules';

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
turndownService.use(gfm);
turndownService.addRule('span', spanRule);
turndownService.addRule('evernote task items', taskItemsRule);
turndownService.addRule('wikistyle links', wikiStyleLinksRule);
turndownService.addRule('images', imagesRule);


export const getTurndownService = (yarleOptions: YarleOptions) => {
    if (yarleOptions.keepMDCharactersOfENNotes){
        turndownService.escape = ((str: string) => str);
    }

    if (yarleOptions.monospaceIsCodeBlock)
        turndownService.addRule('codeblocks', monospaceCodeBlockRule);
    else
        turndownService.addRule('codeblocks', codeBlockRule);

    return turndownService;
};
