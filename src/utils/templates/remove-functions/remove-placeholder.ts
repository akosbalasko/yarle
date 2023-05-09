import * as M from '../match-all';

export const removePlaceholder = (text: string, P: any): string => {
  return text.replace(
    new RegExp(`${P.START_BLOCK}(?<=${P.START_BLOCK})(.*)(?=${P.END_BLOCK})${P.END_BLOCK}${M.MATCH_LF}`,
      'g',
    ),
    '',
  );
};
