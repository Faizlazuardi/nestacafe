export function getStartDate(type: 'Hari' | 'Bulan' | 'Tahun') {
    const date = new Date();

    if (type === 'Hari') {
        date.setHours(0, 0, 0, 0);
    }
    if (type === 'Bulan') {
        date.setMonth(date.getMonth() - 1);
    }
    if (type === 'Tahun') {
        date.setFullYear(date.getFullYear() - 1);
    }

    return date;
}