import { getLanguageItems } from './../../outputLanguages/LanguageFactory';
import { yarleOptions } from '../../yarle';

// Note: this rule must appear *after* use(gfm) so it can override
// turndown-plugin-gfm rule for strikethrough (which always uses single '~')
export const italicRule = {
  filter: ['i'],
  replacement: (content: any) => {
    const languageItems = getLanguageItems(yarleOptions.outputFormat)
    return (content.trim() !== '')
      ? `${languageItems.italic}${content}${languageItems.italic}`
      : content
  },
};
