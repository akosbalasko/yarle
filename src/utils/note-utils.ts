
export const getNoteContent = (note: any): string => {
    return  note.content;
  };

export const isComplex = (note: any): boolean => {
    return note.resource ? true : false;
};
