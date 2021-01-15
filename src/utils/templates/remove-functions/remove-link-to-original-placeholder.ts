import { EOL } from 'os';

import * as T from '../placeholders/original-placeholders';
import { removePlaceholder } from './remove-placeholder';

export const removeLinkToOriginalTemplate = (text: string): string => {
  return removePlaceholder(text, T);
}
