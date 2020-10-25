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

export const getSimpleFilePath = (note: any): string => {

  return getFilePath(paths.simpleMdPath, note);
};

export const getComplexFilePath = (note: any): string => {

  return getFilePath(paths.complexMdPath, note);
};

const clearDistDir = (dstPath: string): void => {
    if (fs.existsSync(dstPath)) {
        fsExtra.removeSync(dstPath);
    }
    fs.mkdirSync(dstPath);
};

export const clearResourceDir = (note: any): void => {

  const relativeWorkDir = `${getResourceDir(paths.complexMdPath, note)}.resources`;
  const absoluteWorkDir = `${paths.resourcePath}/${relativeWorkDir}`;

  clearDistDir(absoluteWorkDir);
};

export const clearResourceDistDir = (): void => {
  clearDistDir(paths.resourcePath);
};
export const clearSimpleNotesDistDir = (): void => {
  clearDistDir(paths.simpleMdPath);
};

export const clearComplexNotesDistDir = (): void => {
  clearDistDir(paths.complexMdPath);
};

export const setPaths = (): void => {

  const enexFolder = yarleOptions.enexFile.split('/');
  const enexFile = (enexFolder.length >= 1 ?  enexFolder[enexFolder.length - 1] : enexFolder[0]).split('.')[0];
  paths.simpleMdPath = `${process.cwd()}/${yarleOptions.outputDir}/simpleNotes`
  paths.complexMdPath = `${process.cwd()}/${yarleOptions.outputDir}/complexNotes`;
  paths.resourcePath = `${process.cwd()}/${yarleOptions.outputDir}/complexNotes/_resources`;
  if (yarleOptions.useEnexFileAsDir) {
    paths.simpleMdPath = `${paths.simpleMdPath}/${enexFile}`;
    paths.complexMdPath = `${paths.complexMdPath}/${enexFile}`;
    paths.resourcePath = `${process.cwd()}/${yarleOptions.outputDir}/complexNotes/${enexFile}/_resources`;
  }

  fsExtra.mkdirsSync(paths.simpleMdPath);
  fsExtra.mkdirsSync(paths.complexMdPath);
  fsExtra.mkdirsSync(paths.resourcePath);
  // clearDistDir(paths.simpleMdPath);
  // clearDistDir(paths.complexMdPath);

};
