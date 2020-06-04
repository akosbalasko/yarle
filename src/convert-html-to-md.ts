import { getTurndownService } from './utils/turndown-service';

export const convertHtml2Md = (content: string) => {
    const contentInMd = getTurndownService().turndown(content);

    return contentInMd && contentInMd !== 'undefined' ? contentInMd : '';
};
