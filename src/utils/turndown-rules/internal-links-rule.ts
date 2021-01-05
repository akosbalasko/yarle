import marked, { Token } from 'marked';
import * as _ from 'lodash';
import { normalizeTitle } from '../filename-utils';
import { OutputFormat } from '../../output-format';
import { yarleOptions } from '../../yarle';
import { getTurndownService } from '../turndown-service';

import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';

export const removeBrackets = (str: string): string => {
    return str.replace(/\[|\]/g, '');
};

export const wikiStyleLinksRule = {
    filter: filterByNodeName('A'),
    replacement: (content: any, node: any) => {
        const nodeProxy = getAttributeProxy(node);

        if (!nodeProxy.href) {
            return '';
        }

        const internalTurndownedContent = getTurndownService(yarleOptions).turndown(removeBrackets(node.innerHTML));
        const lexer = new marked.Lexer({});
        const tokens = lexer.lex(internalTurndownedContent) as any;
        let token: any = {
            mdKeyword: '',
            text: internalTurndownedContent,
        };
        if (tokens.length > 0 && tokens[0]['type'] === 'heading') {
            token = tokens[0];
            token['mdKeyword'] = `${'#'.repeat(tokens[0]['depth'])} `;
        }
        const value = nodeProxy.href.value;
        if (value.match(/^(https?:|www\.|file:|ftp:|mailto:)/)) {
            return (!token['text'] || _.unescape(token['text']) === _.unescape(value))
                ? `<${value}>`
                : `${token['mdKeyword']}[${token['text']}](${value})`;
        }
        if (value.startsWith('evernote://')) {
            const fileName = normalizeTitle(token['text']);
            const displayName = token['text'];
            if (yarleOptions.outputFormat === OutputFormat.ObsidianMD) {
                return `${token['mdKeyword']}[[${fileName}|${displayName}]]`;
            }

            if (yarleOptions.outputFormat === OutputFormat.UrlEncodeMD) {
                return  `${token['mdKeyword']}[${displayName}](${encodeURI(fileName)})`;
            }

            return  `${token['mdKeyword']}[${displayName}](${fileName})`;

        }

        return (yarleOptions.outputFormat === OutputFormat.ObsidianMD)
        ? `${token['mdKeyword']}[[${value} | ${token['text']}]]`
        : (yarleOptions.outputFormat === OutputFormat.StandardMD)
            ? `${token['mdKeyword']}[${token['text']}](${value})`
            : `${token['mdKeyword']}[[${value}]]`;
        // todo embed

        /*return (
            !value.match(/^(https?:|www\.|file:|ftp:|mailto:)/)
            ? `[[${removeBrackets(node.innerHTML)}]]`
            : (yarleOptions.outputFormat === OutputFormat.ObsidianMD)
                ? `![[${removeBrackets(node.innerHTML)}]]`
                : `[${removeBrackets(node.innerHTML)}](${value})`;
        */
    },
};
