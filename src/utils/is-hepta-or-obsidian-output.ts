import { OutputFormat } from "../output-format"
import { yarleOptions } from "../yarle"
import { isHeptaOutput } from "./heptabase/is-hepta-output"

export const isHeptaOrObsidianOutput = (): boolean => {
    return isHeptaOutput() || yarleOptions.outputFormat === OutputFormat.ObsidianMD
}