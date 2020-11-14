
import * as T from '../placeholders/notebook-placeholders';
import { removePlaceholder } from './remove-placeholder';

export const removeNotebookPlaceholder = (text: string): string => {
  
  return removePlaceholder(text, T);
}
