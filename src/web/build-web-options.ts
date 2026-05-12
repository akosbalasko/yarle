import fs from 'fs';
import os from 'os';
import path from 'path';

import { defaultYarleOptions } from '../yarle';
import { OutputFormat } from '../output-format';
import { YarleOptions } from '../YarleOptions';

export interface WebInputFile {
    name: string;
    contentBase64: string;
}

export interface WebConversionRequest {
    files: Array<WebInputFile>;
    outputFormat?: string;
}

export interface PreparedWebConversion {
    inputDir: string;
    outputDir: string;
    options: YarleOptions;
}

const CONFIG_BY_OUTPUT_FORMAT: Record<string, string> = {
    [OutputFormat.LogSeqMD]: path.resolve(__dirname, '../../config.logseq.json'),
    [OutputFormat.Tana]: path.resolve(__dirname, '../../config.tana.json'),
    [OutputFormat.ObsidianMD]: path.resolve(__dirname, '../../config.json'),
    [OutputFormat.StandardMD]: path.resolve(__dirname, '../../config.json'),
    [OutputFormat.Heptabase]: path.resolve(__dirname, '../../config.json'),
};

const TEMPLATE_BY_OUTPUT_FORMAT: Record<string, string> = {
    [OutputFormat.LogSeqMD]: path.resolve(__dirname, '../../sampleTemplate_logseq.tmpl'),
    [OutputFormat.Tana]: path.resolve(__dirname, '../../sampleTemplate_tana.tmpl'),
    [OutputFormat.ObsidianMD]: path.resolve(__dirname, '../../sampleTemplate.tmpl'),
    [OutputFormat.StandardMD]: path.resolve(__dirname, '../../sampleTemplate.tmpl'),
    [OutputFormat.Heptabase]: path.resolve(__dirname, '../../sampleTemplate.tmpl'),
};

const ensureSupportedOutputFormat = (outputFormat?: string): OutputFormat => {
    if (!outputFormat) {
        return OutputFormat.ObsidianMD;
    }

    const allowedFormats = Object.values(OutputFormat);
    if (!allowedFormats.includes(outputFormat as OutputFormat)) {
        throw new Error(`Unsupported output format: ${outputFormat}`);
    }

    return outputFormat as OutputFormat;
};

const sanitizeUploadedFileName = (name: string): string => {
    const baseName = path.basename(name);
    if (!baseName.toLowerCase().endsWith('.enex')) {
        throw new Error(`Only .enex files are supported, received: ${name}`);
    }

    return baseName;
};

const decodeFile = (file: WebInputFile): Buffer => {
    if (!file?.name || !file?.contentBase64) {
        throw new Error('Each uploaded file must include a name and contentBase64');
    }

    return Buffer.from(file.contentBase64, 'base64');
};

const loadBaseConfig = (outputFormat: OutputFormat): YarleOptions => {
    const configPath = CONFIG_BY_OUTPUT_FORMAT[outputFormat];
    const currentTemplatePath = TEMPLATE_BY_OUTPUT_FORMAT[outputFormat];

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as YarleOptions;
    const currentTemplate = fs.readFileSync(currentTemplatePath, 'utf-8');

    return {
        ...defaultYarleOptions,
        ...config,
        currentTemplate,
    };
};

export const prepareWebConversion = (
    request: WebConversionRequest,
): PreparedWebConversion => {
    if (!request?.files?.length) {
        throw new Error('At least one .enex file is required');
    }

    const outputFormat = ensureSupportedOutputFormat(request.outputFormat);
    const inputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'yarle-web-input-'));
    const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'yarle-web-output-'));

    const enexSources = request.files.map(file => {
        const sanitizedName = sanitizeUploadedFileName(file.name);
        const destination = path.join(inputDir, sanitizedName);
        fs.writeFileSync(destination, decodeFile(file));
        return destination;
    });

    return {
        inputDir,
        outputDir,
        options: {
            ...loadBaseConfig(outputFormat),
            enexSources,
            outputDir,
            outputFormat,
        },
    };
};
