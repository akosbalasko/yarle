import { TanaIntermediateFile } from "./types";

export const createNewTanaFile =(): TanaIntermediateFile => {
    return {
        version: 'TanaIntermediateFile V0.1',
        nodes: [],
        supertags: [],
        attributes: [],
        summary: {
            leafNodes:0,
            topLevelNodes: 0,
            totalNodes: 0,
            calendarNodes: 0,
            fields: 0,
            brokenRefs: 0,
        }
    }
}