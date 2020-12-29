import { YarleOptions } from "../src/YarleOptions";

export interface YarleTest {
  options: YarleOptions;
  specialTest?: YarleTestFeature;
  expectedOutputPath?: string;
  testOutputPath: string; 
  name: string;
}

export enum YarleTestFeature {
    skip = 'skip',
    only = 'only',
}