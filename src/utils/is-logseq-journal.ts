import { OutputFormat } from './../output-format'
import { YarleOptions } from './../YarleOptions'

export const isLogseqJournal = (yarleOptions: YarleOptions ):boolean => {
    return yarleOptions.outputFormat === OutputFormat.LogSeqMD && yarleOptions.logseqSettings.journalNotes
}