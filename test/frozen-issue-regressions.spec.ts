import assert from 'assert';
import crypto from 'crypto';
import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';
import { dropTheRope } from '../src/yarle';
import { Tana } from '../src/outputLanguages/Tana';
import { OutputFormat } from '../src/output-format';
import { getFileIndex, getNoteFileName, normalizeFilenameString } from '../src/utils/filename-utils';
import { replaceCodeBlock } from '../src/utils/turndown-rules/replace-code-block';

const { describe, it, before, afterEach } = global as any;
const taskRoot = path.resolve('..', '.runtime', 'synthetic-regressions');

const cdata = (html: string): string => `<content><![CDATA[<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">${html}]]></content>`;
const resourceXml = (name: string, bytes: Buffer): { hash: string; xml: string } => {
  const hash = crypto.createHash('md5').update(bytes).digest('hex');
  return {
    hash,
    xml: `<resource><data encoding="base64">${bytes.toString('base64')}</data><mime>image/png</mime><resource-attributes><timestamp>20260101T000000Z</timestamp><file-name>${name}</file-name></resource-attributes></resource>`,
  };
};
const enex = (contentXml: string, extra = '', title = 'Synthetic Note'): string => `<?xml version="1.0" encoding="UTF-8"?><en-export>${`<note><title>${title}</title>${contentXml}<created>20260101T000000Z</created><updated>20260101T000000Z</updated>${extra}</note>`}</en-export>`;

const convert = async (name: string, xml: string): Promise<{ output: string; noteDir: string }> => {
  const root = path.join(taskRoot, name);
  const input = path.join(root, 'synthetic.enex');
  const output = path.join(root, 'output');
  fs.mkdirSync(root, { recursive: true });
  fs.writeFileSync(input, xml, 'utf8');
  await dropTheRope({
    enexSources: [input],
    outputDir: output,
    outputFormat: OutputFormat.StandardMD,
    skipWebClips: false,
  });
  const noteDir = path.join(output, 'notes', 'synthetic');
  return { output, noteDir };
};

describe('frozen synthetic issue regressions', () => {
  before(() => fs.mkdirSync(taskRoot, { recursive: true }));
  afterEach(() => fsExtra.removeSync(taskRoot));

  it('does not throw for negative padding on a synthetic code div (#719)', () => {
    const node = {
      attributes: { style: { value: 'padding-left:-20px' } },
      parentElement: null as any,
      isBlock: true,
      innerHTML: 'synthetic code',
    };
    assert.doesNotThrow(() => replaceCodeBlock('synthetic code', node));
  });

  it('matches decomposed filesystem names to composed note titles (#717)', () => {
    const dir = path.join(taskRoot, 'nfd-match');
    fs.mkdirSync(dir, { recursive: true });
    const composed = 'ガイド';
    const decomposed = composed.normalize('NFD');
    fs.writeFileSync(path.join(dir, `${decomposed}.md`), 'synthetic');
    assert.strictEqual(getFileIndex(dir, composed), 1);
  });

  it('keeps the Markdown extension within the filename byte limit (#721)', () => {
    const dir = path.join(taskRoot, 'long-title');
    fs.mkdirSync(dir, { recursive: true });
    const title = '界'.repeat(100);
    const filename = getNoteFileName(dir, { title, noteName: title } as any, 'md');
    const sanitized = normalizeFilenameString(filename);
    assert(sanitized.endsWith('.md'), `Expected .md suffix, got ${JSON.stringify(sanitized.slice(-16))}`);
    assert(Buffer.byteLength(sanitized, 'utf8') <= 255);
  });

  it('converts a note whose ENEX content is split across CDATA sections (#720)', async () => {
    const bytes = Buffer.from('synthetic-resource');
    const resource = resourceXml('synthetic.png', bytes);
    const content = `<content><![CDATA[<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd"><en-note>before]]><![CDATA[<en-media hash="${resource.hash}" type="image/png"/>after</en-note>]]></content>`;
    const { noteDir } = await convert('multi-cdata', enex(content, resource.xml));
    const notePath = path.join(noteDir, 'Synthetic Note.md');
    assert(fs.existsSync(notePath), 'Expected synthetic note to be written');
    assert(fs.readFileSync(notePath, 'utf8').includes('synthetic.png'));
  });

  it('does not overwrite a real resource with a same-name data URL thumbnail (#722)', async () => {
    const original = Buffer.from('synthetic-original-resource');
    const thumbnail = Buffer.from('synthetic-thumbnail');
    const resource = resourceXml('photo.png', original);
    const content = cdata(`<en-note><en-media hash="${resource.hash}" type="image/png"/><a href="data:image/png;base64,${thumbnail.toString('base64')}" alt="photo.png">synthetic thumbnail</a></en-note>`);
    const { noteDir } = await convert('data-url-collision', enex(content, resource.xml));
    const resourceDir = path.join(noteDir, '_resources', 'Synthetic_Note.resources');
    assert.deepStrictEqual(fs.readFileSync(path.join(resourceDir, 'photo.png')), original);
    assert(fs.existsSync(path.join(resourceDir, 'photo.1.png')), 'Expected colliding thumbnail to receive a unique filename');
  });

  it('converts an inline style containing a synthetic at-rule (#718)', async () => {
    const content = cdata('<en-note><a href="https://example.invalid/item" style="display:inline-block;width:135px;height:40px;@media only screen{background-image:url(x);">synthetic badge</a></en-note>');
    const { noteDir } = await convert('inline-style', enex(content));
    const notePath = path.join(noteDir, 'Synthetic Note.md');
    assert(fs.existsSync(notePath), 'Expected note to survive malformed CSS parsing');
    assert(fs.readFileSync(notePath, 'utf8').includes('synthetic badge'), 'Expected note content to be preserved');
  });

  it('retains a synthetic task when its task-group wrapper is absent (#724)', async () => {
    const task = '<task><created>20260101T000000Z</created><notelevelid>note-1</notelevelid><taskgroupnotelevelid>group-1</taskgroupnotelevelid><sortweight>0001</sortweight><taskstatus>open</taskstatus><taskflag>false</taskflag><title>synthetic orphan task</title></task>';
    const { noteDir } = await convert('orphan-task', enex(cdata('<en-note><div>synthetic note text</div></en-note>'), task));
    const noteText = fs.readFileSync(path.join(noteDir, 'Synthetic Note.md'), 'utf8');
    assert(noteText.includes('synthetic orphan task'));
  });

  it('retains a synthetic orphan task in Tana output when its group placeholder is absent (#724)', () => {
    const content = JSON.stringify({
      nodes: [{ uid: 'synthetic-root', createdAt: '2026-01-01T00:00:00.000Z', children: [] }],
    });
    const tasks = new Map([['0001', '- [ ] synthetic orphan task']]);
    const updated = new Tana().tagProcess(content, tasks, '<YARLE-EN-V10-TASK>group-1</YARLE-EN-V10-TASK>', content);
    const taskNode = JSON.parse(updated).nodes[0].children[0];
    assert(taskNode.name.includes('synthetic orphan task'));
    assert.strictEqual(taskNode.todoState, 'todo');
  });
});
