import assert from 'assert';
import fs from 'fs';
import mockTimezone from 'timezone-mock';

import * as utils from './../src/utils';
import * as yarle from './../src/yarle';

import { yarleTests } from './yarle-tests';
import { YarleTest, YarleTestFeature } from './yarle-test';

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
      (yarleTest.specialTest === YarleTestFeature.skip)
        ? it.skip
        : (yarleTest.specialTest === YarleTestFeature.only)
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