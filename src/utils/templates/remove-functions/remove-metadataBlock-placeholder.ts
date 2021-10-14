
import * as T from '../placeholders/metadata-placeholders';

import { removePlaceholder } from './remove-placeholder';

export const removeMetadataBlockPlaceholder = (text: string): string => {
  return removePlaceholder(text, T);
};
