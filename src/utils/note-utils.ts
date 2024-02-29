import { EvernoteNoteData } from "./../models";

export const hasResource = (note: EvernoteNoteData): boolean => {
    return note.resource ? true : false;
};

export const isWebClip = (note: EvernoteNoteData): boolean => {
  return note['note-attributes'] && (
  note['note-attributes']['source-application'] === 'webclipper.evernote' ||
              note['note-attributes']['source'] === 'web.clip7');
};
