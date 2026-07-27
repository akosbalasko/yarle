import { FileSystemAdapter, FileSystemStats } from './FileSystemAdapter';

export class BrowserFileSystemAdapter implements FileSystemAdapter {
    private rootHandle: any = null;

    setRootDirectoryHandle(handle: any): void {
        this.rootHandle = handle;
    }

    async readFile(path: string, encoding: 'utf8' = 'utf8'): Promise<string> {
        if (!this.rootHandle) {
            throw new Error('Root directory handle is not set.');
        }
        const handle = await this.getHandle(path, false);
        const file = await handle.getFile();
        return await file.text();
    }

    async writeFile(path: string, data: string | ArrayBuffer, options?: { encoding?: string; base64?: boolean }): Promise<void> {
        if (!this.rootHandle) {
            throw new Error('Root directory handle is not set.');
        }
        const handle = await this.getHandle(path, true);
        const writable = await handle.createWritable();
        if (options?.base64 && typeof data === 'string') {
            const bytes = Uint8Array.from(atob(data), c => c.charCodeAt(0));
            await writable.write(bytes);
        } else if (typeof data === 'string') {
            await writable.write(data);
        } else {
            await writable.write(data);
        }
        await writable.close();
    }

    async appendFile(path: string, data: string): Promise<void> {
        if (!this.rootHandle) {
            throw new Error('Root directory handle is not set.');
        }
        const existing = await this.exists(path);
        if (existing) {
            const content = await this.readFile(path);
            await this.writeFile(path, content + data);
        } else {
            await this.writeFile(path, data);
        }
    }

    async exists(path: string): Promise<boolean> {
        if (!this.rootHandle) {
            throw new Error('Root directory handle is not set.');
        }
        try {
            await this.getHandle(path, false);
            return true;
        } catch {
            return false;
        }
    }

    async mkdir(path: string, options?: { recursive?: boolean }): Promise<void> {
        if (!this.rootHandle) {
            throw new Error('Root directory handle is not set.');
        }
        const segments = path.split('/').filter(Boolean);
        let current = this.rootHandle;
        for (const segment of segments) {
            current = await current.getDirectoryHandle(segment, { create: options?.recursive ?? false });
        }
    }

    async readdir(path: string): Promise<string[]> {
        if (!this.rootHandle) {
            throw new Error('Root directory handle is not set.');
        }
        const dirHandle = await this.getHandle(path, false);
        const results: string[] = [];
        for await (const entry of dirHandle) {
            results.push(entry.name);
        }
        return results;
    }

    async stat(path: string): Promise<FileSystemStats> {
        if (!this.rootHandle) {
            throw new Error('Root directory handle is not set.');
        }
        const handle = await this.getHandle(path, false);
        const isDirectory = handle.kind === 'directory';
        const isFile = handle.kind === 'file';
        const size = isFile ? (await handle.getFile()).size : 0;
        return {
            isFile,
            isDirectory,
            size,
            birthtime: Date.now(),
            mtime: Date.now(),
        };
    }

    async remove(path: string): Promise<void> {
        if (!this.rootHandle) {
            throw new Error('Root directory handle is not set.');
        }
        const segments = path.split('/').filter(Boolean);
        const fileName = segments.pop();
        const parent = await this.getHandle(segments.join('/'), false);
        await parent.removeEntry(fileName as string, { recursive: true });
    }

    async showOpenFilePicker(options?: any): Promise<any[]> {
        // @ts-ignore
        return window.showOpenFilePicker(options);
    }

    async showDirectoryPicker(): Promise<any> {
        // @ts-ignore
        const handle = await window.showDirectoryPicker();
        this.setRootDirectoryHandle(handle);
        return handle;
    }

    private async getHandle(pathString: string, create: boolean): Promise<any> {
        if (!this.rootHandle) {
            throw new Error('Root directory handle is not set.');
        }
        const segments = pathString.split(/[/\\]/).filter(Boolean);
        let current: any = this.rootHandle;
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            if (current.kind !== 'directory') {
                throw new Error('Path segment is not a directory');
            }
            const isLast = i === segments.length - 1;
            if (isLast) {
                try {
                    return await current.getFileHandle(segment, { create });
                } catch {
                    return await current.getDirectoryHandle(segment, { create });
                }
            }
            current = await current.getDirectoryHandle(segment, { create });
        }
        return current;
    }
}
