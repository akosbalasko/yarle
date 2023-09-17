
// Note: this rule must appear *after* use(gfm) so it can override
// turndown-plugin-gfm rule for strikethrough (which always uses single '~')
export const underlineRule = {
  filter: ['u'],
  replacement: (content: any) => {
   return `<u>${content}</u>`
  },
};
