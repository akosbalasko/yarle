import { yarleOptions } from '../../yarle';

import { filterByNodeName } from './filter-by-nodename';
import { getAttributeProxy } from './get-attribute-proxy';
import { OutputFormat } from './../../output-format';
import { isHeptaOrObsidianOutput } from './../is-hepta-or-obsidian-output';
import { ImageSizeFormat } from './../../image-size-format';

export const imagesRule = {
  filter: filterByNodeName('IMG'),
  replacement: (content: any, node: any) => {
    const nodeProxy = getAttributeProxy(node);

    if (!nodeProxy.src) {
      return '';
    }
    const value = nodeProxy.src.value;
    const widthParam = node.width || '';
    const heightParam = node.height || '';
    let realValue = value;
    if (yarleOptions.sanitizeResourceNameSpaces) {
      realValue = realValue.replace(/ /g, yarleOptions.replacementChar);
    } else if (yarleOptions.urlEncodeFileNamesAndLinks) {
      realValue = encodeURI(realValue);
    }
    if (yarleOptions.keepImageSize){
      let sizeString = (widthParam || heightParam) ? ` =${widthParam}x${heightParam}` : '';

      // while this isn't really a standard, it is common enough
      if (yarleOptions.imageSizeFormat === ImageSizeFormat.StandardMD) {

        return `![](${realValue}${sizeString})`;
      } else if (yarleOptions.imageSizeFormat === ImageSizeFormat.ObsidianMD) {
        sizeString = (widthParam || heightParam) ? `${widthParam || 0}x${heightParam || 0}` : '';
        if (realValue.startsWith('./') || realValue.startsWith('..')) {
          return sizeString != '' ? `![[${realValue}\\|${sizeString}]]` : `![[${realValue}${sizeString}]]`;
        } else {
          return `![${sizeString}](${realValue})`;
        }
      }
    }
    const useObsidianMD = isHeptaOrObsidianOutput();
    if (useObsidianMD && !value.match(/^[a-z]+:/)) {
      return `![[${realValue}]]`;
    }

    const srcSpl = nodeProxy.src.value.split('/');

    return `![${srcSpl[srcSpl.length - 1]}](${realValue})`;
  },
};
