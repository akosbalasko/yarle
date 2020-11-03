import he from 'he';
import { X2jOptionsOptional } from 'fast-xml-parser';

/* istanbul ignore next */
export const xmlParserOptions: Partial<X2jOptionsOptional> = {

    attributeNamePrefix : '@_',
    attrNodeName: 'attr', // default is 'false'
    textNodeName : '#text',
    ignoreAttributes : true,
    ignoreNameSpace : false,
    allowBooleanAttributes : false,
    parseNodeValue : true,
    parseAttributeValue : false,
    trimValues: true,
    cdataTagName: '__cdata', // default is 'false'
    cdataPositionChar: '\\c',
    localeRange: '', // To support non english character in tag/attribute values.
    parseTrueNumberOnly: false,
    attrValueProcessor: (a: any) => he.decode(a, {isAttributeValue: true}), // default is a=>a
    tagValueProcessor : (a: any) => he.decode(a), // default is a=>a

};
