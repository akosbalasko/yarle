
import * as CREATIONTIME from './placeholders/createdat-placeholders';
import * as LOCATION from './placeholders/location-placeholders';
import * as ALTITUDE from './placeholders/altitude-placeholders';
import * as NOTEBOOK from './placeholders/notebook-placeholders';
import * as ORIGINALLINK from './placeholders/original-placeholders';
import * as SUBJECTDATE from './placeholders/subject-date-placeholders';
import * as AUTHOR from './placeholders/author-placeholders';
import * as SOURCE from './placeholders/source-placeholders';
import * as SOURCEURL from './placeholders/source-url-placeholders';
import * as SOURCEAPPLICATION from './placeholders/source-application-placeholders';
import * as PLACENAME from './placeholders/place-name-placeholders';
import * as CONTENTCLASS from './placeholders/content-class-placeholders';
import * as YAMLAPPLICATIONDATA from './placeholders/application-data-yaml-list-placeholders';
import * as TAGS from './placeholders/tags-placeholders';
import * as YAMLARRAYTAGS from './placeholders/tags-array-placeholders';
import * as YAMLLISTTAGS from './placeholders/tags-yaml-list-placeholders';
import * as METADATA from './placeholders/metadata-placeholders';
import * as UPDATETIME from './placeholders/updatedat-placeholders';
import * as REMINDERTIME from './placeholders/remindertime-placeholders';
import * as REMINDERDONETIME from './placeholders/reminderdonetime-placeholders';
import * as REMINDERORDER from './placeholders/reminderorder-placeholders';

export const hasCreationTimeInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(CREATIONTIME, templateContent);
};

export const hasReminderTimeInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(REMINDERTIME, templateContent);
};
export const hasReminderDoneTimeInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(REMINDERDONETIME, templateContent);

};
export const hasReminderOrderInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(REMINDERORDER, templateContent);
};

export const hasLocationInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(LOCATION, templateContent);
};
export const hasAltitudeInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(ALTITUDE, templateContent);
};
export const hasNotebookInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(NOTEBOOK, templateContent);
};
export const hasOriginalLinkInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(ORIGINALLINK, templateContent);
};
export const hasSubjectDateInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(SUBJECTDATE, templateContent);
};
export const hasAuthorInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(AUTHOR, templateContent);
};
export const hasSourceInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(SOURCE, templateContent);
};
export const hasSourceURLInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(SOURCEURL, templateContent);
};
export const hasSourceApplicationInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(SOURCEAPPLICATION, templateContent);
};
export const hasPlaceNameInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(PLACENAME, templateContent);
};
export const hasContentClassInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(CONTENTCLASS, templateContent);
};
export const hasApplicationDataInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(YAMLAPPLICATIONDATA, templateContent);
};
export const hasAnyTagsInTemplate = (templateContent: string): boolean => {
    return (hasItemInTemplate(TAGS, templateContent)
    || hasItemInTemplate(YAMLARRAYTAGS, templateContent)
    || hasItemInTemplate(YAMLLISTTAGS, templateContent));
};

export const hasMetadataInTemplate = (templateContent: string): boolean => {
    return templateContent.includes(METADATA.START_BLOCK) &&
    templateContent.includes(METADATA.END_BLOCK);
};
export const hasUpdateTimeInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(UPDATETIME, templateContent);
};
export const hasLinkToOriginalInTemplate = (templateContent: string): boolean => {
    return hasItemInTemplate(ORIGINALLINK, templateContent);
};
const hasItemInTemplate = (item: any, templateContent: string): boolean => {
    return templateContent.includes(item.START_BLOCK) &&
        templateContent.includes(item.CONTENT_PLACEHOLDER) &&
        templateContent.includes(item.END_BLOCK);
};
