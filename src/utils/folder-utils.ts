import fsExtra from 'fs-extra';
import fs from 'fs';
import * as path from 'path';

import { Path } from '../paths';
import { yarleOptions } from '../yarle';

import { getNoteFileName, getNoteName, getUniqueId, normalizeTitle } from './filename-utils';
import { loggerInfo } from './loggerInfo';
import { OutputFormat } from './../output-format';
import { RuntimePropertiesSingleton } from './../runtime-properties';

export const paths: Path = {};
const MAX_PATH = 249;

export const getResourceDir = (dstPath: string, note: any): string => {
  return getNoteName(dstPath, note).replace(/\s/g, '_').substr(0, 50);
};

export const truncatFileName = (fileName: string, uniqueId: string): string => {

  if (fileName.length <= 11) {
    throw Error('FATAL: note folder directory path exceeds the OS limitation. Please pick a destination closer to the root folder.');
  }

  const fullPath = `${getNotesPath()}${path.sep}${fileName}`;

  return fullPath.length <  MAX_PATH ? fileName : `${fileName.slice(0, MAX_PATH - 11)}_${uniqueId}.md`;
};

const truncateFilePath = (note: any, fileName: string, fullFilePath: string): string => {
  const noteIdNameMap = RuntimePropertiesSingleton.getInstance();

  const noteIdMap = noteIdNameMap.getNoteIdNameMapByNoteTitle(normalizeTitle(note.title))[0] || {uniqueEnd: getUniqueId()};


  if (fileName.length <= 11) {
    throw Error('FATAL: note folder directory path exceeds the OS limitation. Please pick a destination closer to the root folder.');
  }

  return `${fullFilePath.slice(0, MAX_PATH - 11)}_${noteIdMap.uniqueEnd}.md`;
  // -11 is the nanoid 5 char +_+ the max possible extension of the note (.md vs .html)
};

const getFilePath = (dstPath: string, note: any, extension: string): string => {
  const fileName = getNoteFileName(dstPath, note, extension);
  const fullFilePath = `${dstPath}${path.sep}${normalizeTitle(fileName)}`;

  return fullFilePath.length <  MAX_PATH ? fullFilePath : truncateFilePath(note, fileName, fullFilePath);
};

export const getMdFilePath = (note: any): string => {
  return getFilePath(paths.mdPath, note, 'md');
};

export const getJsonFilePath = (note: any): string => {
  return getFilePath(paths.mdPath, note, 'json');
};
export const getHtmlFilePath = (note: any): string => {
  return getFilePath(paths.resourcePath, note, 'html');
};

export const getHtmlFileLink = (note: any): string => {
  const filePath = getHtmlFilePath(note);

  return `.${filePath.slice(paths.resourcePath.lastIndexOf(path.sep))}`;
};

const clearDistDir = (dstPath: string): void => {
  if (fs.existsSync(dstPath)) {
    fsExtra.removeSync(dstPath);
  }
  fs.mkdirSync(dstPath);
};

export const getRelativeResourceDir = (note: any): string => {
  const enexFolder = `${path.sep}${yarleOptions.resourcesDir}`;
  if (yarleOptions.haveGlobalResources) {
    return `..${enexFolder}`;
  }

  return yarleOptions.haveEnexLevelResources
    ? `.${enexFolder}`
    : `.${enexFolder}${path.sep}${getResourceDir(paths.mdPath, note)}.resources`;
};

export const getAbsoluteResourceDir = (note: any): string => {
  if (yarleOptions.haveGlobalResources) {
    return path.resolve(paths.resourcePath, '..', '..', yarleOptions.resourcesDir);
  }

  return yarleOptions.haveEnexLevelResources
    ? paths.resourcePath
    : `${paths.resourcePath}${path.sep}${getResourceDir(paths.mdPath, note)}.resources`;
};

const resourceDirClears = new Map<string, number>();
export const clearResourceDir = (note: any): void => {
  const resPath = getAbsoluteResourceDir(note);
  if (!resourceDirClears.has(resPath)) {
    resourceDirClears.set(resPath, 0);
  }

  const clears = resourceDirClears.get(resPath);
  // we're sharing a resource dir, so we can can't clean it more than once
  if ((yarleOptions.haveEnexLevelResources || yarleOptions.haveGlobalResources) && clears >= 1) {
    return;
  }

  clearDistDir(resPath);
  resourceDirClears.set(resPath, clears + 1);
};

export const clearResourceDistDir = (): void => {
  clearDistDir(paths.resourcePath);
};
export const clearMdNotesDistDir = (): void => {
  clearDistDir(paths.mdPath);
};

export const setPaths = (enexSource: string): void => {
  // loggerInfo('setting paths');
  const enexFolder = enexSource.split(path.sep);
  // loggerInfo(`enex folder split: ${JSON.stringify(enexFolder)}`);
  const enexFile = (enexFolder.length >= 1 ?  enexFolder[enexFolder.length - 1] : enexFolder[0]).split(/.enex$/)[0];
  // loggerInfo(`enex file: ${enexFile}`);

  const outputDir = path.isAbsolute(yarleOptions.outputDir)
    ? yarleOptions.outputDir
    : `${process.cwd()}${path.sep}${yarleOptions.outputDir}`;

  paths.mdPath = `${outputDir}${path.sep}notes${path.sep}`;
  paths.resourcePath = `${outputDir}${path.sep}notes${path.sep}${yarleOptions.resourcesDir}`;

  // loggerInfo(`Skip enex filename from output? ${yarleOptions.skipEnexFileNameFromOutputPath}`);
  if (!yarleOptions.skipEnexFileNameFromOutputPath) {
    paths.mdPath = `${paths.mdPath}${enexFile}`;
    // loggerInfo(`mdPath: ${paths.mdPath}`);
    paths.resourcePath = `${outputDir}${path.sep}notes${path.sep}${enexFile}${path.sep}${yarleOptions.resourcesDir}`;
  }

  if (yarleOptions.outputFormat === OutputFormat.LogSeqMD) {
    const folderName = yarleOptions.logseqSettings.journalNotes ? 'journal' : 'pages';
    paths.mdPath = `${outputDir}${path.sep}${folderName}${path.sep}`;
    paths.resourcePath = `${outputDir}${path.sep}${yarleOptions.resourcesDir}`;
  }

  fsExtra.mkdirsSync(paths.mdPath);
  if ((!yarleOptions.haveEnexLevelResources && !yarleOptions.haveGlobalResources) || 
    yarleOptions.outputFormat === OutputFormat.LogSeqMD) {
    fsExtra.mkdirsSync(paths.resourcePath);
  }
  loggerInfo(`path ${paths.mdPath} created`);
  // clearDistDir(paths.simpleMdPath);
  // clearDistDir(paths.complexMdPath);
};

export const getNotesPath = (): string => {
  return paths.mdPath;
};
