import moment from 'moment';

export enum EvernoteTaskStatus {
    Open = 'open',
    Closed= 'closed',
}
export interface EvernoteTask {
    $name: string;
    created: Date;
    creator: string;
    lasteditor: string;
    notelevelid: string;
    sortweight: string;
    statusupdated: Date;
    taskflag: boolean;
    taskgroupnotelevelid: string;
    taskstatus: EvernoteTaskStatus;
    title: string;
    duedate: Date;
    duedateoption: string;
    reminderdate: Date;
    reminderdateoption: string;
    updated: Date;
}

export const mapEvernoteTask = (pureTask: any): EvernoteTask => {
    return {
        ...pureTask,
        created: getDateFromProperty(pureTask.created),
        statusupdated: getDateFromProperty(pureTask.statusupdated),
        updated: getDateFromProperty(pureTask.updated),
        duedate: getDateFromProperty(pureTask.duedate),
        taskflag: pureTask.taskflag === 'true',
        reminderdate: pureTask.reminder ? getDateFromProperty(pureTask.reminder.reminderdate) : undefined,
        sortweight: pureTask.sortweight

    };
};

const getDateFromProperty = (property: string) => {
    return property
        ?  moment(property, 'YYYYMMDDThhmmssZ').toDate()
        : undefined;
};
