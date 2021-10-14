
import * as T from '../placeholders/updatedat-placeholders';

import { removePlaceholder } from './remove-placeholder';

export const removeUpdatedAtPlaceholder = (text: string): string => {
  return removePlaceholder(text, T);
};
