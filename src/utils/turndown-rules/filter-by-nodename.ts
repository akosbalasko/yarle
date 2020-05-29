export const filterByNodeName = (nodename: string): any => {
    return (node: any): any =>  {
        return node.nodeName === nodename;
    };
};
