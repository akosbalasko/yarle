import TurndownService from 'turndown';
import { gfm } from 'joplin-turndown-plugin-gfm';

import { YarleOptions } from './../YarleOptions';
import {
    divRule,
    imagesRule,
    italicRule,
    newLineRule,
    spanRule,
    strikethroughRule,
    taskItemsRule,
    wikiStyleLinksRule } from './turndown-rules';
import { OutputFormat } from './../output-format';
import { taskListRule } from './turndown-rules/task-list-rule';
import { removeNewlines } from './remove-newlines';
import { tanaTableBlock, tanaTableColBlock, tanaTableRowBlock } from './../constants';
import { underlineRule } from './turndown-rules/underline-rule';
import { encryptRule } from './turndown-rules/encrypt-rule';

export const getTurndownService = (yarleOptions: YarleOptions) => {
    /* istanbul ignore next */
    const turndownService = new TurndownService({
            br: '',
            ...yarleOptions.turndownOptions,
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
    turndownService.addRule('strikethrough', strikethroughRule);
    turndownService.addRule('evernote task items', taskItemsRule);
    turndownService.addRule('wikistyle links', wikiStyleLinksRule);
    turndownService.addRule('images', imagesRule);
    turndownService.addRule('list', taskListRule);
    turndownService.addRule('italic', italicRule);
    turndownService.addRule('underline', underlineRule);
    turndownService.addRule('encrypt', encryptRule);
    if (yarleOptions.outputFormat === OutputFormat.LogSeqMD) {
        turndownService.addRule('logseq_hr', {
                filter: ['hr'],
                // tslint:disable-next-line:typedef
                replacement(content: any) {
                return '\r  ---'; // this \r is important, used to diff from \n
            },
        });
    }

    if(yarleOptions.outputFormat === OutputFormat.Tana) {
        turndownService.addRule('tanaSkipTableRule', {
            filter: ['table'],
            replacement(content: any) {
                return `${tanaTableBlock}${removeNewlines(content)}`;
            },
        })
        turndownService.addRule('tanaSkipTableRowRule', {
            filter: ['tr'],
            replacement(content: any) {
                return `${tanaTableRowBlock}${removeNewlines(content)}`;
            },
        })
        turndownService.addRule('tanaSkipTableColRule', {
            filter: ['td'],
            replacement(content: any) {
                return `${tanaTableColBlock}${removeNewlines(content)}`;
            },
        })
    }
    if (yarleOptions.keepMDCharactersOfENNotes) {
        turndownService.escape = ((str: string) => str);
    }

    turndownService.addRule('divBlock', divRule);
    /*
    turndownService.addRule('v10Tasks', v10TaskBlockRule);

    if (yarleOptions.monospaceIsCodeBlock) {
        turndownService.addRule('codeblocks', monospaceCodeBlockRule);
    } else {
        turndownService.addRule('codeblocks', codeBlockRule);
    }
    */
    if (yarleOptions.keepOriginalAmountOfNewlines) {
        turndownService.addRule('newline', newLineRule);
    }

    return turndownService;
};
