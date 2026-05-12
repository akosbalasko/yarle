const { expect } = require('chai');
const fs = require('fs');

const { OutputFormat } = require('../src/output-format');
const { prepareWebConversion } = require('../src/web/build-web-options');

describe('prepareWebConversion', () => {
    it('creates temp input files and merges web conversion options', () => {
        const prepared = prepareWebConversion({
            files: [
                {
                    name: 'sample.enex',
                    contentBase64: Buffer.from('<en-export></en-export>').toString('base64'),
                },
            ],
            outputFormat: OutputFormat.LogSeqMD,
        });

        expect(prepared.options.outputFormat).to.equal(OutputFormat.LogSeqMD);
        expect(prepared.options.currentTemplate).to.be.a('string').and.not.empty;
        expect(prepared.options.enexSources).to.have.length(1);
        expect(fs.existsSync(prepared.options.enexSources[0])).to.equal(true);
        expect(fs.existsSync(prepared.outputDir)).to.equal(true);

        fs.rmSync(prepared.inputDir, { recursive: true, force: true });
        fs.rmSync(prepared.outputDir, { recursive: true, force: true });
    });

    it('rejects non-enex uploads', () => {
        expect(() =>
            prepareWebConversion({
                files: [
                    {
                        name: 'notes.txt',
                        contentBase64: Buffer.from('nope').toString('base64'),
                    },
                ],
            }),
        ).to.throw('Only .enex files are supported');
    });
});
