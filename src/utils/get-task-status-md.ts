import { EvernoteTaskStatus } from './../models/EvernoteTask';
import { checkboxDone, checkboxTodo } from './../constants';

export const getTaskStatusMd = (task: any): string => {
    return (task.taskstatus === EvernoteTaskStatus.Open)
      ? checkboxTodo
      : checkboxDone;
  }