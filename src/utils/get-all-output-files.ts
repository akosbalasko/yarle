
import * as fs from 'fs';
import * as path from 'path';

export const getAllFiles = (dirPath: string, arrayOfFiles: Array<any>): Array<any> => {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];
    files.forEach(file => {
      if (fs.statSync(`${dirPath}${path.sep}${file}`).isDirectory()) {
        arrayOfFiles = getAllFiles(`${dirPath}${path.sep}${file}`, arrayOfFiles);
      } else {
        arrayOfFiles.push(path.join(__dirname, dirPath, '/', file));
      }
    });

    return arrayOfFiles;
  };