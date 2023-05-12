import { OutputFormat } from "../../output-format"
import { yarleOptions } from "../../yarle"

export const isTanaOutput = (): boolean => {
    return yarleOptions.outputFormat === OutputFormat.Tana
}