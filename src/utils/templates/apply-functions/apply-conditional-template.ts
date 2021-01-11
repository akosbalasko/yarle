export const applyConditionalTemplate = (text: string, P: any, newValue: string): string => {
    return text
        .replace(new RegExp(`${P.CONTENT_PLACEHOLDER}`,'g'), newValue)
        .replace(new RegExp(`${P.START_BLOCK}`,'g'), '')
        .replace(new RegExp(`${P.END_BLOCK}`,'g'), '');
}
