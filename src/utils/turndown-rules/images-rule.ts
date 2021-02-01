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

    // while this isn't really a standard, it is common enough
    if (yarleOptions.keepImageSize === OutputFormat.StandardMD) {
      const widthParam = node.width || '';
      const heightParam = node.height || '';

      return `![](${value} =${widthParam}x${heightParam})`;
    } else if (yarleOptions.keepImageSize === OutputFormat.ObsidianMD) {
      return `![|${node.width}x${node.height}](${value})`;
    }

    const useObsidianMD = yarleOptions.outputFormat === OutputFormat.ObsidianMD;
    if (useObsidianMD && !value.match(/^[a-z]+:/)) {
      return `![[${value}]]`;
    }

    const srcSpl = nodeProxy.src.value.split('/');
    if (yarleOptions.outputFormat === OutputFormat.UrlEncodeMD) {
      return `![${srcSpl[srcSpl.length - 1]}](${encodeURI(value)})`;
    }

    return `![${srcSpl[srcSpl.length - 1]}](${value})`;
  },
};
