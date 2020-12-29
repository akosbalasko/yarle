import assert from 'assert';
import fs from 'fs';
import mockTimezone from 'timezone-mock';

import * as utils from './../src/utils';
import * as yarle from './../src/yarle';

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
      const output = `${__dirname}/../${yarleTest.options.outputDir}/${yarleTest.testOutputPath}`;
      const expectedOutput = yarleTest.expectedOutputPath ? `${__dirname}/${yarleTest.expectedOutputPath}` : undefined;

      assert.ok(fs.existsSync(output));
      if (expectedOutput)
        assert.equal(
          fs.readFileSync(output, 'utf8',),
          fs.readFileSync(expectedOutput, 'utf8'),
        );

    });
  }
})