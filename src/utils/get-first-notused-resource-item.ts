import { ResourceHashItem } from './../models/ResourceHash';

export const getFirstNotUsedResourceItem = (itemHash: any): ResourceHashItem => {
    const firstUnusedItemId =  Object
        .keys(itemHash)
        .filter(itemId => itemId.startsWith('any'))
        .sort()
        .find(itemId => itemHash[itemId]['alreadyUsed'] === false);

    return itemHash[firstUnusedItemId] as ResourceHashItem;
};
