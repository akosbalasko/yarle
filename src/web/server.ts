/* istanbul ignore file */
import fs from 'fs';
import http from 'http';
import path from 'path';

import fsExtra from 'fs-extra';
import { zip } from 'zip-a-folder';

import { dropTheRope } from '../yarle';
import {
    prepareWebConversion,
    type WebConversionRequest,
} from './build-web-options';

const HOST = process.env.YARLE_WEB_HOST || '127.0.0.1';
const PORT = Number(process.env.YARLE_WEB_PORT || '4317');
const PUBLIC_DIR = path.resolve(__dirname, 'public');

const send = (
    res: http.ServerResponse,
    statusCode: number,
    headers: Record<string, string>,
    body: string | Buffer,
): void => {
    res.writeHead(statusCode, headers);
    res.end(body);
};

const sendJson = (
    res: http.ServerResponse,
    statusCode: number,
    payload: unknown,
): void => {
    send(
        res,
        statusCode,
        { 'Content-Type': 'application/json; charset=utf-8' },
        JSON.stringify(payload),
    );
};

const readRequestBody = async (req: http.IncomingMessage): Promise<string> =>
    new Promise((resolve, reject) => {
        const chunks: Array<Buffer> = [];
        let size = 0;

        req.on('data', chunk => {
            size += chunk.length;
            if (size > 50 * 1024 * 1024) {
                reject(new Error('Request body too large'));
                req.destroy();
                return;
            }
            chunks.push(Buffer.from(chunk));
        });
        req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
        req.on('error', reject);
    });

const serveStatic = async (
    res: http.ServerResponse,
    filePath: string,
): Promise<void> => {
    const absPath = path.join(PUBLIC_DIR, filePath);
    const content = fs.readFileSync(absPath);
    const mimeType = filePath.endsWith('.js')
        ? 'application/javascript; charset=utf-8'
        : 'text/html; charset=utf-8';

    send(res, 200, { 'Content-Type': mimeType }, content);
};

const handleConvert = async (
    req: http.IncomingMessage,
    res: http.ServerResponse,
): Promise<void> => {
    const body = await readRequestBody(req);
    const request = JSON.parse(body) as WebConversionRequest;
    const prepared = prepareWebConversion(request);

    try {
        await dropTheRope(prepared.options);
        const zipPath = `${prepared.outputDir}.zip`;
        await zip(prepared.outputDir, zipPath);
        const archive = fs.readFileSync(zipPath);

        send(
            res,
            200,
            {
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename="yarle-export.zip"',
            },
            archive,
        );
    } finally {
        await fsExtra.remove(prepared.inputDir);
        await fsExtra.remove(prepared.outputDir);
        await fsExtra.remove(`${prepared.outputDir}.zip`);
    }
};

const server = http.createServer(async (req, res) => {
    try {
        if (req.method === 'GET' && req.url === '/') {
            await serveStatic(res, 'index.html');
            return;
        }

        if (req.method === 'GET' && req.url === '/app.js') {
            await serveStatic(res, 'app.js');
            return;
        }

        if (req.method === 'POST' && req.url === '/api/convert') {
            await handleConvert(req, res);
            return;
        }

        sendJson(res, 404, { error: 'Not found' });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        sendJson(res, 500, { error: message });
    }
});

server.listen(PORT, HOST, () => {
    // tslint:disable-next-line:no-console
    console.log(`Yarle web app running at http://${HOST}:${PORT}`);
});
