import marked, { Token } from 'marked';
import * as _ from 'lodash';

import { getUniqueId, normalizeTitle } from '../filename-utils';
import { OutputFormat } from '../../output-format';
import { yarleOptions } from '../../yarle';
import { getTurndownService } from '../turndown-service';
import { RuntimePropertiesSingleton } from '../../runtime-properties';

import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';
import { isTOC } from './../../utils/is-toc';
import { isHeptaOrObsidianOutput } from './../../utils/is-hepta-or-obsidian-output';
import sanitize from 'sanitize-filename';

export const removeBrackets = (str: string): string => {
    return str.replace(/\[|\]/g, '');
};
export const removeDoubleBackSlashes = (str: string): string => {
    return str.replace(/\\/g, '');
};
const isEvernoteLink = (value: string): boolean => {
    return value.startsWith('evernote:///view') || value.startsWith('https://www.evernote.com')
}
const getEvernoteUniqueId = (value: string): string => {
    const urlSpl = value.split('/').reverse()
    return ((urlSpl[0] !== '')
        ? [urlSpl[0],urlSpl[1]]
        : [urlSpl[1],urlSpl[2]]).join('/')
}
export const wikiStyleLinksRule = {
    filter: filterByNodeName('A'),
    replacement: (content: any, node: any) => {
        const nodeProxy = getAttributeProxy(node);
        let internalTurndownedContent =
            getTurndownService(yarleOptions).turndown(removeBrackets(node.innerHTML));
        internalTurndownedContent = removeDoubleBackSlashes(internalTurndownedContent);
        if (!nodeProxy.href) {
            return (node.innerHTML === '' || !node.innerHTML)
                ? ''
                : internalTurndownedContent;
        }

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
        const value = nodeProxy.href ? nodeProxy.href.value : internalTurndownedContent;
        const type = nodeProxy.type ? nodeProxy.type.value : undefined ;
        const realValue = yarleOptions.urlEncodeFileNamesAndLinks ? encodeURI(value) : value;

        if (type === 'file') {
            return isHeptaOrObsidianOutput()
                ? `![[${realValue}]]`
                : getShortLinkIfPossible(token, value);
        }
        if (value.match(/^(https?:|tel:|www\.|file:|busycalevent:|ftp:|mailto:)/) && !value.startsWith("https://www.evernote.com")) {
            return getShortLinkIfPossible(token, value);
        }

        const displayName = sanitize(token['text'], {replacement: yarleOptions.replacementChar || '_'}).replace(/[\[\]\#\^]/g, '')

        const mdKeyword = token['mdKeyword'];

        // handle ObsidianMD internal link display name
        const omitObsidianLinksDisplayName = isHeptaOrObsidianOutput()
            && yarleOptions.obsidianSettings?.omitLinkDisplayName;
        const renderedObsidianDisplayName = omitObsidianLinksDisplayName ? '' : `|${displayName}`;

        if (isEvernoteLink(value) ) {
            const fileName = normalizeTitle(token['text']);
            const noteIdNameMap = RuntimePropertiesSingleton.getInstance();
            const uniqueEnd = getUniqueId();
            const id = getEvernoteUniqueId(value)
            if (isTOC(noteIdNameMap.getCurrentNoteName())) {
                noteIdNameMap.addItemToTOCMap({ id, url: value, title: fileName, uniqueEnd  });

            } else {
                noteIdNameMap.addItemToMap({ id, url: value, title: fileName, uniqueEnd  });
            }

            const linkedNoteId = id;
            if (isHeptaOrObsidianOutput()) {
                return `${mdKeyword}[[${linkedNoteId}${extension}${renderedObsidianDisplayName}]]`;
            }

            return `${mdKeyword}[${displayName}](${linkedNoteId}${extension})`;
        }

        return (isHeptaOrObsidianOutput())
        ? `${mdKeyword}[[${realValue}${renderedObsidianDisplayName}]]`
        : (yarleOptions.outputFormat === OutputFormat.StandardMD || yarleOptions.outputFormat === OutputFormat.LogSeqMD)
            ? `${mdKeyword}[${displayName}](${realValue})`
            : `${mdKeyword}[[${realValue}]]`;
    },
};

export const getShortLinkIfPossible = (token: any, value: string): string => {
    return (!token['text'] || _.unescape(token['text']) === _.unescape(value))
                ? yarleOptions.generateNakedUrls ? value : `<${value}>`
                : `${token['mdKeyword']}[${token['text']}](${value})`;
};
