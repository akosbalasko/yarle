
import * as T from '../placeholders/location-placeholders';
import { removePlaceholder } from './remove-placeholder';

export const removeLocationPlaceholder = (text: string): string => {
  return removePlaceholder(text, T);
}