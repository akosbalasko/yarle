export const applyConditionalTemplate = (text: string, P: any, newValue: string): string => {
    return text
        .replace(P.CONTENT_PLACEHOLDER, newValue)
        .replace(P.START_BLOCK, '')
        .replace(P.END_BLOCK, '');
}
