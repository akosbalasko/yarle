import * as fs from 'fs';
import * as path from 'path';
import { YarleOptions } from '../YarleOptions';
import { loggerInfo } from './loggerInfo';

interface EnexFileEntry {
    fullPath: string;
    relativeDir: string;
}

const findEnexFilesRecursively = (sourceDir: string, relativeDir: string = ''): EnexFileEntry[] => {
    const results: EnexFileEntry[] = [];
    const currentDir = relativeDir ? `${sourceDir}${path.sep}${relativeDir}` : sourceDir;
    const entries = fs.readdirSync(currentDir);

    for (const entry of entries) {
        const fullEntryPath = `${currentDir}${path.sep}${entry}`;
        if (fs.statSync(fullEntryPath).isDirectory()) {
            const subRelativeDir = relativeDir ? `${relativeDir}${path.sep}${entry}` : entry;
            results.push(...findEnexFilesRecursively(sourceDir, subRelativeDir));
        } else if (entry.match(/.*\.enex$/i)) {
            results.push({ fullPath: fullEntryPath, relativeDir });
        }
    }

    return results;
};

export const expandEnexSourceDirs = (options: YarleOptions): void => {
    // If all entries are already .enex file paths, nothing to expand
    if (options.enexSources.every(s => s.endsWith('.enex'))) {
        return;
    }

    // Expand the first directory source (matches original CLI behavior)
    const sourceDir = options.enexSources[0];

    if (!fs.statSync(sourceDir).isDirectory()) {
        return;
    }

    const enexEntries = findEnexFilesRecursively(sourceDir);

    const relativeDirs: Record<string, string> = {};
    for (const entry of enexEntries) {
        relativeDirs[entry.fullPath] = entry.relativeDir;
    }

    // Detect name collisions in flat mode and auto-promote to naming structure
    if (!options.preserveStackFolderStructure && !options.preserveStackNamingStructure) {
        const nameCount = new Map<string, number>();
        for (const entry of enexEntries) {
            const baseName = path.basename(entry.fullPath, '.enex').toLowerCase();
            nameCount.set(baseName, (nameCount.get(baseName) || 0) + 1);
        }

        for (const [baseName, count] of nameCount) {
            if (count > 1) {
                loggerInfo(`WARNING: Name collision detected for "${baseName}.enex" (${count} files). ` +
                    `Auto-enabling preserveStackNamingStructure to avoid data loss.`);
                options.preserveStackNamingStructure = true;
                break;
            }
        }
    }

    options._enexRelativeDirs = relativeDirs;
    options.enexSources = enexEntries.map(entry => entry.fullPath);
};
