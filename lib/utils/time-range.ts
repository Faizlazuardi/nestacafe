import { TIME_RANGES, TimeRange } from "./date";

export function parseTimeRange(
    value: string | null,
    fallback: TimeRange = 'Hari'
): TimeRange {
    return TIME_RANGES.includes(value as TimeRange)
        ? (value as TimeRange)
        : fallback;
}
