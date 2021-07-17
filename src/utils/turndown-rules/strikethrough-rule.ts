// Note: this rule must appear *after* use(gfm) so it can override
// turndown-plugin-gfm rule for strikethrough (which always uses single '~')
export const strikethroughRule = {
  filter: ['del', 's', 'strike'],
  replacement: (content: any) => {
    return `~~${content}~~`;
  },
};
