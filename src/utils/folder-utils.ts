import * as fsExtra from 'fs-extra';
import * as fs from 'fs';

import { Path } from '../paths';
import { yarleOptions } from '../yarle';

import { getNoteFileName, getNoteName } from './filename-utils';

export const paths: Path = {};

export const getResourceDir = (dstPath: string, note: any): string => {
  return getNoteName(dstPath, note).replace(/\s/g, '_');

};

const getFilePath = (dstPath: string, note: any): string => {

  return `${dstPath}/${getNoteFileName(dstPath, note)}`;
};

export const getMdFilePath = (note: any): string => {

  return getFilePath(paths.mdPath, note);
};

const clearDistDir = (dstPath: string): void => {
    if (fs.existsSync(dstPath)) {
        fsExtra.removeSync(dstPath);
    }
    fs.mkdirSync(dstPath);
};

export const clearResourceDir = (note: any): void => {

  const relativeWorkDir = `${getResourceDir(paths.mdPath, note)}.resources`;
  const absoluteWorkDir = `${paths.resourcePath}/${relativeWorkDir}`;

  clearDistDir(absoluteWorkDir);
};

export const clearResourceDistDir = (): void => {
  clearDistDir(paths.resourcePath);
};
export const clearMdNotesDistDir = (): void => {
  clearDistDir(paths.mdPath);
};

export const setPaths = (): void => {

  const enexFolder = yarleOptions.enexFile.split('/');
  const enexFile = (enexFolder.length >= 1 ?  enexFolder[enexFolder.length - 1] : enexFolder[0]).split('.')[0];
  
  paths.mdPath = `${process.cwd()}/${yarleOptions.outputDir}/notes/`;
  paths.resourcePath = `${process.cwd()}/${yarleOptions.outputDir}/notes/_resources`
  if (!yarleOptions.skipEnexFileNameFromOutputPath) {
    paths.mdPath = `${paths.mdPath}${enexFile}`;
    paths.resourcePath = `${process.cwd()}/${yarleOptions.outputDir}/notes/${enexFile}/_resources`;
  }
  fsExtra.mkdirsSync(paths.mdPath);
  fsExtra.mkdirsSync(paths.resourcePath);
  // clearDistDir(paths.simpleMdPath);
  // clearDistDir(paths.complexMdPath);

};
