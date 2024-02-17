import { yarleOptions } from '../../yarle';
import { getAttributeProxy } from './get-attribute-proxy';
import { performDecryption } from './../decrypt' 
import { getTurndownService } from '../turndown-service';

// Note: this rule must appear *after* use(gfm) so it can override
// turndown-plugin-gfm rule for strikethrough (which always uses single '~')
export const encryptRule = {
  filter: ['en-crypt'],
  replacement: (content: any, node: any) => {
    const nodeProxy = getAttributeProxy(node);
    const encryptedContent = performDecryption(content, yarleOptions.encryptionPasswords)
    return getTurndownService(yarleOptions).turndown(encryptedContent);
  },
};
