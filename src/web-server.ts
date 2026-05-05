/* istanbul ignore file */
import http from 'http';
import { URL } from 'url';

import { dropTheRope } from './yarle';
import { applyLinks } from './utils/apply-links';
import { LanguageFactory } from './outputLanguages/LanguageFactory';
import { YarleOptions } from './YarleOptions';

const defaultPort = Number(process.env.YARLE_WEB_PORT || 4312);

const indexHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>YARLE Web Starter</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; max-width: 900px; }
    textarea, input { width: 100%; margin: 6px 0 14px; padding: 8px; }
    button { padding: 10px 14px; cursor: pointer; }
    .card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; }
    pre { background: #f7f7f7; padding: 12px; border-radius: 8px; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>YARLE Web Starter</h1>
  <p>This starter runs locally and calls a small HTTP API that uses the existing conversion engine.</p>
  <div class="card">
    <label>ENEX path (absolute)</label>
    <input id="enex" placeholder="C:\\\\notes\\\\my-notebook.enex" />
    <label>Output directory (absolute)</label>
    <input id="output" placeholder="C:\\\\notes\\\\out" />
    <label>Template text (optional)</label>
    <textarea id="template" rows="6" placeholder="Leave empty to use default template"></textarea>
    <button id="run">Convert</button>
  </div>
  <h3>Result</h3>
  <pre id="result">Idle</pre>
  <script>
    const runButton = document.getElementById('run');
    const result = document.getElementById('result');
    runButton.addEventListener('click', async () => {
      result.textContent = 'Running...';
      const payload = {
        enexSources: [document.getElementById('enex').value],
        outputDir: document.getElementById('output').value,
        currentTemplate: document.getElementById('template').value || undefined,
      };
      try {
        const response = await fetch('/api/convert', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const body = await response.json();
        result.textContent = JSON.stringify(body, null, 2);
      } catch (error) {
        result.textContent = String(error);
      }
    });
  </script>
</body>
</html>`;

const readJsonBody = (request: http.IncomingMessage): Promise<Record<string, unknown>> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    request.on('data', chunk => chunks.push(Buffer.from(chunk)));
    request.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    request.on('error', reject);
  });

const writeJson = (response: http.ServerResponse, statusCode: number, payload: unknown): void => {
  response.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
};

const runConversion = async (payload: Record<string, unknown>): Promise<{ outputNotebookFolders: string[] }> => {
  const options = payload as YarleOptions;
  const outputNotebookFolders = await dropTheRope(options);

  applyLinks(options, outputNotebookFolders);
  const languageFactory = new LanguageFactory();
  const targetLanguage = languageFactory.createLanguage(options.outputFormat);
  await targetLanguage.postProcess(options, outputNotebookFolders);

  return { outputNotebookFolders };
};

export const runWebServer = (port = defaultPort): http.Server => {
  const server = http.createServer(async (request, response) => {
    const requestUrl = new URL(request.url || '/', `http://${request.headers.host || `localhost:${port}`}`);

    if (request.method === 'GET' && requestUrl.pathname === '/') {
      response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      response.end(indexHtml);
      return;
    }

    if (request.method === 'POST' && requestUrl.pathname === '/api/convert') {
      try {
        const payload = await readJsonBody(request);
        if (!Array.isArray(payload.enexSources) || payload.enexSources.length === 0 || !payload.outputDir) {
          writeJson(response, 400, { error: 'enexSources[] and outputDir are required.' });
          return;
        }

        const conversionResult = await runConversion(payload);
        writeJson(response, 200, { ok: true, ...conversionResult });
      } catch (error) {
        writeJson(response, 500, { ok: false, error: (error as Error).message });
      }
      return;
    }

    writeJson(response, 404, { error: 'Not found' });
  });

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`YARLE Web Starter running at http://localhost:${port}`);
  });

  return server;
};

if (require.main === module) {
  runWebServer();
}
