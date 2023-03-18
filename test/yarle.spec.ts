import assert from 'assert';
import fs from 'fs';
import mockTimezone from 'timezone-mock';
import eol from 'eol';
import * as path from 'path';
import * as utils from './../src/utils';
import * as yarle from './../src/yarle';
import { LOGFILE } from './../src/utils';

import { yarleTests } from './yarle-tests';
import { YarleTest } from './yarle-test';
import { YarleTestModifierOptions } from './yarle-test-modifier-options';

describe('Yarle simple cases', async () => {
  before(() => {
    mockTimezone.register('Europe/London');

  });

  after(() => {
    mockTimezone.unregister();

  });

  afterEach(async () => {
    utils.clearMdNotesDistDir();

  });

  const tests: Array<YarleTest> = yarleTests;
  for (const yarleTest of tests) {
    const conditionalTest =
      (yarleTest.testModifier === YarleTestModifierOptions.skip)
        ? it.skip
        : (yarleTest.testModifier === YarleTestModifierOptions.only)
          ? it.only
          : it;

    conditionalTest(yarleTest.name, async () => {

      await yarle.dropTheRope(yarleTest.options);
      console.log(`conversion log: ${fs.readFileSync(LOGFILE)}`);

      const output = `${__dirname}${path.sep}..${path.sep}${yarleTest.options.outputDir}${path.sep}${yarleTest.testOutputPath}`;
      const expectedOutput = yarleTest.expectedOutputPath ? `${__dirname}${path.sep}${yarleTest.expectedOutputPath}` : undefined;

      assert.ok(fs.existsSync(output));
      if (expectedOutput)
        assert.equal(
          eol.auto(fs.readFileSync(output, 'utf8')),
          fs.readFileSync(expectedOutput, 'utf8'),
        );

    }).timeout(5000);
  }
})