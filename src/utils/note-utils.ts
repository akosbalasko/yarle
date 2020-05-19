import { getTitle, paths } from '.';

export const getNoteContent = (note: any): string => {
    return  note['content']['__cdata'];
  };

export const getNoteTitle = (note: any): string => {
    const path = isComplex(note) ? paths.complexMdPath : paths.simpleMdPath;

    return getTitle(path, note);
};

export const isComplex = (note: any): boolean => {
    return note['resource'] ? true : false;
};
