import { InternalLink } from './InternalLink';

export interface NoteData {
    title?: string;
    tags?: string;
    content?: string;
    originalContent?: string;
    htmlContent?: string;
    createdAt?: string;
    updatedAt?: string;
    sourceUrl?: string;
    location?: string;
    linkToOriginal?: string;
    notebookName?: string;
    internalLinks?: Array<InternalLink>;
    reminderTime?: string;
    reminderDoneTime?: string;
    reminderOrder?: string;
  }
