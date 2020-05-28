export const toUtc = (date: Date) => new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
