import { YarleOptions } from "../src/YarleOptions";
import { YarleTestModifierOptions } from './yarle-test-modifier-options';

export interface YarleTest {
  options: YarleOptions;
  testModifier?: YarleTestModifierOptions;
  expectedOutputPath?: string;
  testOutputPath: string; 
  name: string;
}
