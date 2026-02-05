export const TIME_RANGES = ['Hari', 'Bulan', 'Tahun'] as const;
export type TimeRange = typeof TIME_RANGES[number];

export function getStartDate(type: TimeRange): Date {
    const date = new Date();

    switch (type) {
        case 'Hari':
            date.setHours(0, 0, 0, 0);
            break;
        
        case 'Bulan':
            date.setMonth(date.getMonth() - 1);
            break;
        
        case 'Tahun':
            date.setFullYear(date.getFullYear() - 1);
            break;
    }
    
    return date;
}
