import { yarleOptions } from '../../yarle';

import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';
import { OutputFormat } from './../../output-format';

export const imagesRule = {
  filter: filterByNodeName('IMG'),
  replacement: (content: any, node: any) => {
    const nodeProxy = getAttributeProxy(node);

    if (!nodeProxy.src) {
      return '';
    }
    const value = nodeProxy.src.value;
    const realValue = yarleOptions.urlEncodeFileNamesAndLinks ? encodeURI(value) : value;

    // while this isn't really a standard, it is common enough
    if (yarleOptions.keepImageSize === OutputFormat.StandardMD || yarleOptions.keepImageSize === OutputFormat.LogSeqMD) {
      const widthParam = node.width || '';
      const heightParam = node.height || '';

      return `![](${realValue} =${widthParam}x${heightParam})`;
    } else if (yarleOptions.keepImageSize === OutputFormat.ObsidianMD) {
      return `![|${node.width}x${node.height}](${realValue})`;
    }

    const useObsidianMD = yarleOptions.outputFormat === OutputFormat.ObsidianMD;
    if (useObsidianMD && !value.match(/^[a-z]+:/)) {
      return `![[${realValue}]]`;
    }

    const srcSpl = nodeProxy.src.value.split('/');

    return `![${srcSpl[srcSpl.length - 1]}](${realValue})`;
  },
};
