export const getAttributeProxy = (node: any): any => {
    const handler = {
        get(target: any, key: any): any {
            return target[key];
        },
    };

    return new Proxy(node.attributes, handler);
};
