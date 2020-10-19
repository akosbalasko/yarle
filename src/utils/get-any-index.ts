export const getAnyIndex = (resourceHashObject: any): number => {
    return Object.keys(resourceHashObject).filter(item => item.startsWith('any')).length;
}