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
        const extension = yarleOptions.addExtensionToInternalLinks ? '.md' : '';
        let token: any = {
            mdKeyword: '',
            text: internalTurndownedContent,
        };
        if (tokens.length > 0 && tokens[0]['type'] === 'heading') {
            token = tokens[0];
            token['mdKeyword'] = `${'#'.repeat(tokens[0]['depth'])} `;
        }
        const value = nodeProxy.href.value;
        const type = nodeProxy.type ? nodeProxy.type.value : undefined ;
        const realValue = yarleOptions.urlEncodeFileNamesAndLinks ? encodeURI(value) : value;

        if (type === 'file'){
            return yarleOptions.outputFormat === OutputFormat.ObsidianMD
                ? `![[${realValue}]]`
                : getShortLinkIfPossible(token, value);
        }
        if (value.match(/^(https?:|www\.|file:|ftp:|mailto:)/)) {
            return getShortLinkIfPossible(token, value);
        }
        if (value.startsWith('evernote://')) {
            const fileName = normalizeTitle(token['text']);
            const displayName = token['text'];
            const realFileName = yarleOptions.urlEncodeFileNamesAndLinks ? encodeURI(fileName) : fileName;

            if (yarleOptions.outputFormat === OutputFormat.ObsidianMD) {
                return `${token['mdKeyword']}[[${realFileName}${extension}|${displayName}]]`;
            }

            return  `${token['mdKeyword']}[${displayName}](${fileName}${extension})`;

        }

        return (yarleOptions.outputFormat === OutputFormat.ObsidianMD)
        ? `${token['mdKeyword']}[[${realValue} | ${token['text']}]]`
        : (yarleOptions.outputFormat === OutputFormat.StandardMD)
            ? `${token['mdKeyword']}[${token['text']}](${realValue})`
            : `${token['mdKeyword']}[[${realValue}]]`;
    },
};

export const getShortLinkIfPossible = (token: any, value: string): string => {
    return (!token['text'] || _.unescape(token['text']) === _.unescape(value))
                ? yarleOptions.generateNakedUrls ? value : `<${value}>`
                : `${token['mdKeyword']}[${token['text']}](${value})`;
}