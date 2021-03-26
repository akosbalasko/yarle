import fsExtra from 'fs-extra';
import fs from 'fs';
import * as path from 'path';
import { Path } from '../paths';
import { yarleOptions } from '../yarle';

import { getNoteFileName, getNoteName } from './filename-utils';
import { NoteData } from 'models';

export const paths: Path = {};

export const getResourceDir = (note: any): string => {
  return getNoteName(paths.mdPath, note).replace(/\s/g, '_');
};

const getFilePath = (dstPath: string, note: any): string => {
  return `${dstPath}/${getNoteFileName(dstPath, note)}`;
};

export const getNoteNameByMdPath = (note: any): string => {
  return getNoteName(paths.mdPath, note);
}

export const getMdFilePath = (note: any): string => {
  return getFilePath(paths.mdPath, note);
};

export const getHtmlFilePath = (note: any): string => {
  return getFilePath(paths.resourcePath, note).replace(/\.md$/, '.html');
};

export const getHtmlFileLink = (note: any): string => {
  const path = getHtmlFilePath(note);

  return `.${path.slice(paths.resourcePath.lastIndexOf('/'))}`;
};

const clearDistDir = (dstPath: string): void => {
  if (fs.existsSync(dstPath)) {
    fsExtra.removeSync(dstPath);
  }
  fs.mkdirSync(dstPath);
};

export const getRelativeResourceDir = (note: any): string => {
  return yarleOptions.haveEnexLevelResources ? './_resources' : `./_resources/${getResourceDir(note)}.resources`;
};

export const getAbsoluteResourceDir = (note: any): string => {
  return yarleOptions.haveEnexLevelResources ? paths.resourcePath : `${paths.resourcePath}/${getResourceDir(note)}.resources`;
};

const resourceDirClears = new Map<string, number>();
export const clearResourceDir = (note: any): void => {
  const path = getAbsoluteResourceDir(note);
  if (!resourceDirClears.has(path)) {
    resourceDirClears.set(path, 0);
  }

  const clears = resourceDirClears.get(path);

  // we're sharing a resource dir, so we can can't clean it more than once
  if (yarleOptions.haveEnexLevelResources && clears >= 1) {
    return;
  }

  clearDistDir(path);
  resourceDirClears.set(path, clears + 1);
};

export const clearResourceDistDir = (): void => {
  clearDistDir(paths.resourcePath);
};
export const clearMdNotesDistDir = (): void => {
  clearDistDir(paths.mdPath);
};

export const setPaths = (): void => {
  const enexFolder = yarleOptions.enexSource.split('/');
  const enexFile = (enexFolder.length >= 1 ?  enexFolder[enexFolder.length - 1] : enexFolder[0]).split('.')[0];
  const outputDir = path.isAbsolute(yarleOptions.outputDir)
    ? yarleOptions.outputDir
    : `${process.cwd()}/${yarleOptions.outputDir}`;

  paths.mdPath = `${outputDir}/notes/`;
  paths.resourcePath = `${outputDir}/notes/_resources`;
  if (!yarleOptions.skipEnexFileNameFromOutputPath) {
    paths.mdPath = `${paths.mdPath}${enexFile}`;
    paths.resourcePath = `${outputDir}/notes/${enexFile}/_resources`;
  }
  fsExtra.mkdirsSync(paths.mdPath);
  fsExtra.mkdirsSync(paths.resourcePath);
  // clearDistDir(paths.simpleMdPath);
  // clearDistDir(paths.complexMdPath);
};
