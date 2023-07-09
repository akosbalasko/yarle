import { YarleStatistics } from "./models/YarleStatistics"

export const calculateStatistics = (noteNumber: number, failed: number, skipped: number): YarleStatistics => {
    return {
        notes: {
            total: noteNumber,
            success: noteNumber - failed,
            failed,
            skipped,
        }
    }
}