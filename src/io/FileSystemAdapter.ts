export interface FileSystemStats {
    isFile: boolean;
    isDirectory: boolean;
    size: number;
    birthtime: number;
    mtime: number;
}

export interface FileSystemAdapter {
    readFile(path: string, encoding?: 'utf8'): Promise<string>;
    writeFile(path: string, data: string | ArrayBuffer, options?: { encoding?: string; base64?: boolean }): Promise<void>;
    appendFile(path: string, data: string): Promise<void>;
    exists(path: string): Promise<boolean>;
    mkdir(path: string, options?: { recursive?: boolean }): Promise<void>;
    readdir(path: string): Promise<string[]>;
    stat(path: string): Promise<FileSystemStats>;
    remove(path: string): Promise<void>;
    createReadStream?(path: string): any;
    setRootDirectoryHandle?(handle: any): void;
    showOpenFilePicker?(options?: any): Promise<any[]>;
    showDirectoryPicker?(): Promise<any>;
}
