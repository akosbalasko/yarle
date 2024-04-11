import { InternalLink } from './InternalLink';

export interface NoteData {
    title?: string;
    created?:string;
    noteName?: string;
    tags?: string;
    content?: string;
    originalContent?: string;
    htmlContent?: string;
    markdownContent?: string;
    appliedMarkdownContent?: string;
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

export interface EvernoteNoteData {
  _type_id: 'EvernoteNoteData';
  title?: string;
  created?: string;
  updated?: string;
  content?: string;
  resource?: any;
  noteName?: string;
  tag?: any;
  "note-attributes"?: NoteAttributes;
}

interface NoteAttributes {
  'source-application'?: string;
  'source-url'?: string;
  'source'?: string;
  'reminder-time'?: string;
  'reminder-order'?: string;
  'reminder-done-time'?: string;
  longitude?: string;
  latitude?: string;
  
}