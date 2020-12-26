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

    if (yarleOptions.outputFormat === OutputFormat.ObsidianMD &&
        !value.match(/^[a-z]+:/)) {
      return `![[${value}]]`;
    }

    const srcSpl = nodeProxy.src.value.split('/');
    if (yarleOptions.outputFormat === OutputFormat.UrlEncodeMD) {
      return `![${srcSpl[srcSpl.length - 1]}](${encodeURI(value)})`;
    }

    return `![${srcSpl[srcSpl.length - 1]}](${value})`;
  },
};
