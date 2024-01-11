export const removeNewlines = (content: string): string => {
    return content.replace(/\r|\n/g,'')
}