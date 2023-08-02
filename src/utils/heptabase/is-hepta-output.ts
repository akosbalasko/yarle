import { OutputFormat } from "../../output-format"
import { yarleOptions } from "../../yarle"

export const isHeptaOutput = (): boolean => {
    return yarleOptions.outputFormat === OutputFormat.Heptabase
}