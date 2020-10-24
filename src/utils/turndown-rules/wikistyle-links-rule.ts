import { Rule } from 'turndown';
import * as marked from 'marked';
import { OutputFormat } from './../../output-format';
import { yarleOptions } from './../../yarle';
import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';
import { getTurndownService } from './../../utils/turndown-service';

export const removeBrackets = (str: string): string => {
    return str.replace(/\[|\]/g,'');
}
export const wikiStyleLinksRule = {
    filter: filterByNodeName('A'),
    replacement: (content: any, node: any) => {
        const nodeProxy = getAttributeProxy(node);
        if (nodeProxy.href) {
            /*internalLink [[]]
            realLink []()
            anchor [[a#v|c]]
            */
            /*if (nodeProxy.href.value.startsWith('evernote://'))
                return `[[${removeBrackets(node.innerHTML)}]]`
            else*/
            const internalTurndownedContent = getTurndownService().turndown(removeBrackets(node.innerHTML));
            const lexer = new marked.Lexer({});
            const tokens = lexer.lex(internalTurndownedContent) as any;
            let tokenToBeRestructured: any = {
                mdKeyword: '',
                text: internalTurndownedContent
            };
            if (tokens.length > 0 && tokens[0]['type'] === 'heading'){
                tokenToBeRestructured = tokens[0];
                tokenToBeRestructured['mdKeyword'] = `${'#'.repeat(tokens[0]['depth'])} `;
            }
            
            if (nodeProxy.href.value.startsWith('http') || 
                nodeProxy.href.value.startsWith('www') ||
                nodeProxy.href.value.startsWith('file')) {
                    
                    return `${tokenToBeRestructured['mdKeyword']}[${tokenToBeRestructured['text']}](${nodeProxy.href.value})`
                }
            if (nodeProxy.href.value.startsWith('evernote://'))
                return  `${tokenToBeRestructured['mdKeyword']}[[${tokenToBeRestructured['text']}]]`;

            return (yarleOptions.outputFormat === OutputFormat.ObsidianMD) 
            ? `${tokenToBeRestructured['mdKeyword']}[[${nodeProxy.href.value} | ${tokenToBeRestructured['text']}]]`
            : `${tokenToBeRestructured['mdKeyword']}[[${nodeProxy.href.value}]]`
            // todo embed

            /*return (
                (!nodeProxy.href.value.startsWith('http') &&
                 !nodeProxy.href.value.startsWith('www')) ||
                 nodeProxy.href.value.startsWith('evernote://')
                )
                ? `[[${removeBrackets(node.innerHTML)}]]`
                : (yarleOptions.outputFormat === OutputFormat.ObsidianMD)
                    ? `![[${removeBrackets(node.innerHTML)}]]`
                    : `[${removeBrackets(node.innerHTML)}](${nodeProxy.href.value})`;
            */
        }
    },
};
