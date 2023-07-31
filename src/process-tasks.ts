import { cloneDeep } from 'lodash';
import moment from 'moment';

import { yarleOptions } from './yarle';
import { TaskOutputFormat } from './task-output-format';
import { EvernoteTask } from './models/EvernoteTask';
import { getTaskStatusMd } from './utils/get-task-status-md';

const MEDIUM_PRIORITY_ICON = '🔼';
const LOW_PRIORITY_ICON = '🔽';
const DUE_DATE_ICON = '📅';
const SCHEDULE_DATE_ICON = '⏳';

export const processTaskFactory = (outputFormat: TaskOutputFormat): Function => {
  switch (outputFormat) {
    case TaskOutputFormat.ObsidianMD:
      return convertTasktoMd;
    default :
      return convertTasktoPlainMdTask;
  }
};

const convertTasktoPlainMdTask = (task: EvernoteTask, notebookName: string): string => {
  const taskStatusMd = getTaskStatusMd(task)
  const title = task.title ? ` ${task.title}` : '';

  return `${taskStatusMd}${title}`;
};

export const convertTasktoMd = (task: EvernoteTask, notebookName: string): string => {
    const taskStatusMd = getTaskStatusMd(task)
    const title = task.title ? ` ${task.title}` : '';
    const tag = yarleOptions.obsidianTaskTag !== '' ? ` ${yarleOptions.obsidianTaskTag}` : '';
    const duedate = task.duedate && !isNaN(task.duedate.getTime())
      ? ` ${DUE_DATE_ICON} ${convertDateFormat(task.duedate)}`
      : '';
    const reminder = task.reminderdate ? ` ${SCHEDULE_DATE_ICON} ${convertDateFormat(task.reminderdate)}` : '';

    const priority = task.taskflag ? ` ${MEDIUM_PRIORITY_ICON}` : ` ${LOW_PRIORITY_ICON}`;

    return `${taskStatusMd}${tag}${title}${duedate}${reminder}${priority}`;
  };

const convertDateFormat = (dateProp: Date): string => {
  return moment(dateProp).format('YYYY-MM-DD').toString();
};
