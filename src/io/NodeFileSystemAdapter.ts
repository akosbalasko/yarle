import * as fs from 'fs';
import * as path from 'path';
import fsExtra from 'fs-extra';
import { FileSystemAdapter, FileSystemStats } from './FileSystemAdapter';

const toStats = (stat: fs.Stats): FileSystemStats => ({
    isFile: stat.isFile(),
    isDirectory: stat.isDirectory(),
    size: stat.size,
    birthtime: stat.birthtimeMs,
    mtime: stat.mtimeMs,
});

export class NodeFileSystemAdapter implements FileSystemAdapter {
    async readFile(filePath: string, encoding: 'utf8' = 'utf8'): Promise<string> {
        return fs.readFileSync(filePath, encoding);
    }

    async writeFile(filePath: string, data: string | ArrayBuffer, options?: { encoding?: string; base64?: boolean }): Promise<void> {
        if (options?.base64 && typeof data === 'string') {
            fs.writeFileSync(filePath, data, 'base64');
        } else if (typeof data === 'string') {
            fs.writeFileSync(filePath, data, options?.encoding || 'utf8');
        } else {
            fs.writeFileSync(filePath, Buffer.from(data));
        }
    }

    async appendFile(filePath: string, data: string): Promise<void> {
        fs.appendFileSync(filePath, data, 'utf8');
    }

    async exists(filePath: string): Promise<boolean> {
        return fs.existsSync(filePath);
    }

    async mkdir(dirPath: string, options?: { recursive?: boolean }): Promise<void> {
        fsExtra.mkdirsSync(dirPath);
    }

    async readdir(dirPath: string): Promise<string[]> {
        return fs.readdirSync(dirPath);
    }

    async stat(filePath: string): Promise<FileSystemStats> {
        return toStats(fs.statSync(filePath));
    }

    async remove(filePath: string): Promise<void> {
        await fsExtra.remove(filePath);
    }

    createReadStream(path: string): any {
        return fs.createReadStream(path);
    }
}
