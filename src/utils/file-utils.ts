import * as fs from 'fs';

import { setFileDates } from './content-utils';
import { logger } from './../utils/logger';
import { yarleOptions } from './../yarle';
import { isLogseqJournal } from './is-logseq-journal';
import {getCreationTime} from './content-utils'

export const writeFile = (absFilePath: string, data: any, note: any): void => {
    try {
      if (isLogseqJournal(yarleOptions) && fs.existsSync(absFilePath)){
        // put the title as a first line
        const compoundJournalNoteTitle = `# Journal Note for ${getCreationTime(note)}`
        const currentContent = fs.readFileSync(absFilePath, 'UTF-8')
        if (!currentContent.startsWith(compoundJournalNoteTitle)){
          const updatedContent = `${compoundJournalNoteTitle}\n\n${currentContent}`
          fs.writeFileSync(absFilePath, updatedContent)
        }

        fs.appendFileSync(absFilePath, data)

      }
      else {
        fs.writeFileSync(absFilePath, data);
        setFileDates(absFilePath, note);
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      logger.error('Cannot write file ', e);
      throw e;
    }
  };
