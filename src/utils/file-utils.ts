import * as fs from 'fs';

import { setFileDates } from './content-utils';
import { logger } from './../utils/logger';
import { yarleOptions } from './../yarle';
import { isLogseqJournal } from './is-logseq-journal';
import {getCreationTime} from './content-utils'
import { EvernoteNoteData } from './../models';

export const writeFile = (absFilePath: string, noteContent: string, pureNoteData: EvernoteNoteData): void => {
    try {
      if (isLogseqJournal(yarleOptions) && fs.existsSync(absFilePath)){
        // put the title as a first line
        const compoundJournalNoteTitle = `# Journal Note for ${getCreationTime(pureNoteData)}`
        const currentContent = fs.readFileSync(absFilePath, 'UTF-8')
        if (!currentContent.startsWith(compoundJournalNoteTitle)){
          const updatedContent = `${compoundJournalNoteTitle}\n\n${currentContent}`
          fs.writeFileSync(absFilePath, updatedContent)
        }

        fs.appendFileSync(absFilePath, noteContent)

      }
      else {
        fs.writeFileSync(absFilePath, noteContent);
        setFileDates(absFilePath, pureNoteData.created, pureNoteData.updated);
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      logger.error('Cannot write file ', e);
      throw e;
    }
  };

  export const updateFileContentSafely = (filePath: string, updatedContent: string): void => {
    const {birthtime, mtime} = fs.statSync(filePath)
    console.log(`replaced output written to: ${filePath}`);
    fs.writeFileSync(filePath, updatedContent);
    setFileDates(filePath, birthtime, mtime)
}