import { getTurndownService } from './utils/turndown-service';

export const convertHtml2Md = (content: string) => {
    return getTurndownService().turndown(content);
  };
