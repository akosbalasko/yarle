import { YarleOptions } from "YarleOptions";

export interface YarleStatistics{
    notes?: {
        total: number,
        success: number,
        failed: number,
        skipped: number,
    },
    size?: number,
    config?: YarleOptions
}