
export const getNoteContent = (note: any): string => {
    return  note.content;
  };

export const isComplex = (note: any): boolean => {
    return note.resource ? true : false;
};

export const isWebClip = (note: any): boolean => {
  return note['note-attributes'] && (
  note['note-attributes']['source-application'] === 'webclipper.evernote' ||
              note['note-attributes']['source'] === 'web.clip7');
};
