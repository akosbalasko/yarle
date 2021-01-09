
import * as CREATIONTIME from './placeholders/createdat-placeholders';
import * as LOCATION from './placeholders/location-placeholders';
import * as NOTEBOOK from './placeholders/notebook-placeholders';
import * as ORIGINALLINK from './placeholders/original-placeholders';
import * as SOURCEURL from './placeholders/sourceurl-placeholders'
import * as TAGS from './placeholders/tags-placeholders';
import * as METADATA from './placeholders/metadata-placeholders';
import * as UPDATETIME from './placeholders/updatedat-placeholders';


export const hasCreationTimeInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(CREATIONTIME, templateContent);
}

export const hasLocationInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(LOCATION, templateContent);
}
export const hasNotebookInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(NOTEBOOK, templateContent);
}
export const hasOriginalLinkInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(ORIGINALLINK, templateContent);
}
export const hasSourceURLInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(SOURCEURL, templateContent);
}
export const hasTagsInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(TAGS, templateContent);
}
export const hasMetadataInTemplate = (templateContent: string): boolean => {
    return templateContent.includes(METADATA.START_BLOCK) &&
    templateContent.includes(METADATA.END_BLOCK);
}
export const hasUpdateTimeInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(UPDATETIME, templateContent);
}
export const hasLinkToOriginalInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(ORIGINALLINK, templateContent);
}
const hasItemInTemplate = (item: any, templateContent: string): boolean => {
    return templateContent.includes(item.START_BLOCK) &&
        templateContent.includes(item.CONTENT_PLACEHOLDER) &&
        templateContent.includes(item.END_BLOCK);
}
