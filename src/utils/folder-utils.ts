import fsExtra from 'fs-extra';
import fs from 'fs';
import * as path from 'path';
import { Path } from '../paths';
import { yarleOptions } from '../yarle';

import { getNoteFileName, getNoteName } from './filename-utils';
import { loggerInfo } from './loggerInfo';
import { logger } from './logger';

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

export const getHtmlFilePath = (note: any): string => {
  return getFilePath(paths.resourcePath, note).replace(/\.md$/, '.html');
};

export const getHtmlFileLink = (note: any): string => {
  const filePath = getHtmlFilePath(note);

  return `.${filePath.slice(paths.resourcePath.lastIndexOf(yarleOptions.pathSeparator))}`;
};

const clearDistDir = (dstPath: string): void => {
  if (fs.existsSync(dstPath)) {
    fsExtra.removeSync(dstPath);
  }
  fs.mkdirSync(dstPath);
};

export const getRelativeResourceDir = (note: any): string => {
  return yarleOptions.haveEnexLevelResources ? `.${yarleOptions.pathSeparator}_resources` : `.${yarleOptions.pathSeparator}_resources${yarleOptions.pathSeparator}${getResourceDir(paths.mdPath, note)}.resources`;
};

export const getAbsoluteResourceDir = (note: any): string => {
  return yarleOptions.haveEnexLevelResources ? paths.resourcePath : `${paths.resourcePath}${yarleOptions.pathSeparator}${getResourceDir(paths.mdPath, note)}.resources`;
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
  loggerInfo('setting paths');
  const enexFolder = yarleOptions.enexSource.split(yarleOptions.pathSeparator);
  const enexFile = (enexFolder.length >= 1 ?  enexFolder[enexFolder.length - 1] : enexFolder[0]).split('.')[0];
  const outputDir = path.isAbsolute(yarleOptions.outputDir)
    ? yarleOptions.outputDir
    : `${process.cwd()}${yarleOptions.pathSeparator}${yarleOptions.outputDir}`;

  paths.mdPath = `${outputDir}${yarleOptions.pathSeparator}notes${yarleOptions.pathSeparator}`;
  paths.resourcePath = `${outputDir}${yarleOptions.pathSeparator}notes${yarleOptions.pathSeparator}_resources`;
  if (!yarleOptions.skipEnexFileNameFromOutputPath) {
    paths.mdPath = `${paths.mdPath}${enexFile}`;
    paths.resourcePath = `${outputDir}${yarleOptions.pathSeparator}notes${yarleOptions.pathSeparator}${enexFile}${yarleOptions.pathSeparator}_resources`;
  }
  fsExtra.mkdirsSync(paths.mdPath);
  fsExtra.mkdirsSync(paths.resourcePath);
  logger.info(`path ${paths.mdPath} created`);
  // clearDistDir(paths.simpleMdPath);
  // clearDistDir(paths.complexMdPath);
};
