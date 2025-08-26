// Native JavaScript Date utility functions
// No external dependencies required

/**
 * Common date and time format patterns
 */
export enum DateTimeFormat {
    // Date formats
    DATE_ONLY = 'YYYY-MM-DD',
    DATE_SLASH = 'YYYY/MM/DD',
    DATE_DOT = 'YYYY.MM.DD',
    DATE_DASH = 'DD-MM-YYYY',
    DATE_US = 'MM/DD/YYYY',
    DATE_EU = 'DD/MM/YYYY',

    // Time formats
    TIME_24H = 'HH:mm:ss',
    TIME_24H_SHORT = 'HH:mm',
    TIME_12H = 'hh:mm:ss A',
    TIME_12H_SHORT = 'hh:mm A',

    // DateTime formats
    DATETIME_DEFAULT = 'YYYY-MM-DD HH:mm:ss',
    DATETIME_ISO = 'YYYY-MM-DDTHH:mm:ss',
    DATETIME_DISPLAY = 'MMM DD, YYYY hh:mm A',
    DATETIME_FULL = 'dddd, MMMM DD, YYYY hh:mm A',
    DATETIME_SHORT = 'MM/DD/YY HH:mm',

    // Database formats
    DATABASE_DATETIME = 'YYYY-MM-DD HH:mm:ss',
    DATABASE_DATE = 'YYYY-MM-DD',
    DATABASE_TIME = 'HH:mm:ss',

    // API formats
    API_DATE = 'YYYY-MM-DD',
    API_DATETIME = 'YYYY-MM-DDTHH:mm:ss.SSSZ',

    // Display formats
    DISPLAY_DATE_LONG = 'MMMM DD, YYYY',
    DISPLAY_DATE_SHORT = 'MMM DD, YYYY',
    DISPLAY_DATE_COMPACT = 'MM/DD/YY',
    DISPLAY_DATETIME_LONG = 'MMMM DD, YYYY hh:mm A',
    DISPLAY_DATETIME_SHORT = 'MMM DD hh:mm A',

    // Hotel specific formats
    HOTEL_CHECKIN = 'YYYY-MM-DD 15:00:00',
    HOTEL_CHECKOUT = 'YYYY-MM-DD 11:00:00',
    RESERVATION_DATE = 'MMM DD, YYYY',
    RESERVATION_TIME = 'hh:mm A',

    // Report formats
    REPORT_DATE = 'YYYY-MM-DD',
    REPORT_DATETIME = 'YYYY-MM-DD HH:mm',
    REPORT_FILENAME = 'YYYYMMDD_HHmmss',

    // Log formats
    LOG_TIMESTAMP = 'YYYY-MM-DD HH:mm:ss.SSS',
    LOG_DATE = 'YYYY-MM-DD',
}

/**
 * Common timezone identifiers
 */
export enum TimeZone {
    UTC = 'UTC',
    EST = 'America/New_York',
    PST = 'America/Los_Angeles',
    CST = 'America/Chicago',
    MST = 'America/Denver',
    GMT = 'Europe/London',
    CET = 'Europe/Paris',
    JST = 'Asia/Tokyo',
    IST = 'Asia/Kolkata',
    AEST = 'Australia/Sydney',
}

/**
 * Time unit types for date manipulation
 */
export type TimeUnit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

/**
 * Helper function to pad numbers with leading zeros
 */
const pad = (num: number, size: number = 2): string => {
    return num.toString().padStart(size, '0');
};

/**
 * Helper function to convert Date input to Date object
 */
const toDate = (date: string | Date): Date => {
    return date instanceof Date ? date : new Date(date);
};

/**
 * Format date according to pattern
 */
const formatDate = (date: Date, pattern: string): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthNamesShort = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const dayNames = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];

    const is12Hour = pattern.includes('hh') || pattern.includes('A');
    const displayHours = is12Hour ? (hours % 12 || 12) : hours;
    const ampm = hours >= 12 ? 'PM' : 'AM';

    return pattern
        .replace('YYYY', year.toString())
        .replace('YY', year.toString().slice(-2))
        .replace('MMMM', monthNames[month - 1])
        .replace('MMM', monthNamesShort[month - 1])
        .replace('MM', pad(month))
        .replace('DD', pad(day))
        .replace('dddd', dayNames[date.getDay()])
        .replace('HH', pad(hours))
        .replace('hh', pad(displayHours))
        .replace('mm', pad(minutes))
        .replace('ss', pad(seconds))
        .replace('SSS', pad(milliseconds, 3))
        .replace('A', ampm);
};

/**
 * Get current date and time
 */
export const getCurrentDate = (): Date => {
    return new Date();
};

/**
 * Get current date in UTC
 */
export const getCurrentDateUTC = (): Date => {
    const now = new Date();
    return new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
};

/**
 * Format date to string with custom format or enum
 */
export const formatDateTime = (
    date: string | Date,
    format: string | DateTimeFormat = DateTimeFormat.DATE_ONLY
): string => {
    return formatDate(toDate(date), format);
};

/**
 * Format date using predefined enum format
 */
export const formatWithEnum = (
    date: string | Date,
    format: DateTimeFormat
): string => {
    return formatDate(toDate(date), format);
};

/**
 * Format date to ISO string
 */
export const formatToISO = (date: string | Date): string => {
    return toDate(date).toISOString();
};

/**
 * Format date for database storage (MySQL format)
 */
export const formatForDatabase = (date: string | Date): string => {
    return formatDate(toDate(date), DateTimeFormat.DATABASE_DATETIME);
};

/**
 * Format date for display (human readable)
 */
export const formatForDisplay = (date: string | Date): string => {
    return formatDate(toDate(date), DateTimeFormat.DATETIME_DISPLAY);
};

/**
 * Format date only (no time)
 */
export const formatDateOnly = (date: string | Date): string => {
    return formatDate(toDate(date), DateTimeFormat.DATE_ONLY);
};

/**
 * Format time only (no date)
 */
export const formatTimeOnly = (date: string | Date): string => {
    return formatDate(toDate(date), DateTimeFormat.TIME_24H);
};

/**
 * Parse date from string
 */
export const parseDate = (dateString: string): Date => {
    return new Date(dateString);
};

/**
 * Add time to a date
 */
export const addTime = (
    date: string | Date,
    amount: number,
    unit: TimeUnit
): Date => {
    const d = toDate(date);
    const result = new Date(d);

    switch (unit) {
        case 'millisecond':
            result.setMilliseconds(result.getMilliseconds() + amount);
            break;
        case 'second':
            result.setSeconds(result.getSeconds() + amount);
            break;
        case 'minute':
            result.setMinutes(result.getMinutes() + amount);
            break;
        case 'hour':
            result.setHours(result.getHours() + amount);
            break;
        case 'day':
            result.setDate(result.getDate() + amount);
            break;
        case 'week':
            result.setDate(result.getDate() + (amount * 7));
            break;
        case 'month':
            result.setMonth(result.getMonth() + amount);
            break;
        case 'year':
            result.setFullYear(result.getFullYear() + amount);
            break;
    }

    return result;
};

/**
 * Subtract time from a date
 */
export const subtractTime = (
    date: string | Date,
    amount: number,
    unit: TimeUnit
): Date => {
    return addTime(date, -amount, unit);
};

/**
 * Get start of day
 */
export const startOfDay = (date: string | Date): Date => {
    const d = toDate(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
};

/**
 * Get end of day
 */
export const endOfDay = (date: string | Date): Date => {
    const d = toDate(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
};

/**
 * Get start of month
 */
export const startOfMonth = (date: string | Date): Date => {
    const d = toDate(date);
    return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
};

/**
 * Get end of month
 */
export const endOfMonth = (date: string | Date): Date => {
    const d = toDate(date);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
};

/**
 * Check if date is today
 */
export const isToday = (date: string | Date): boolean => {
    const d = toDate(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
};

/**
 * Check if date is yesterday
 */
export const isYesterday = (date: string | Date): boolean => {
    const d = toDate(date);
    const yesterday = subtractTime(new Date(), 1, 'day');
    return d.toDateString() === yesterday.toDateString();
};

/**
 * Check if date is tomorrow
 */
export const isTomorrow = (date: string | Date): boolean => {
    const d = toDate(date);
    const tomorrow = addTime(new Date(), 1, 'day');
    return d.toDateString() === tomorrow.toDateString();
};

/**
 * Check if date is in the past
 */
export const isPast = (date: string | Date): boolean => {
    return toDate(date).getTime() < Date.now();
};

/**
 * Check if date is in the future
 */
export const isFuture = (date: string | Date): boolean => {
    return toDate(date).getTime() > Date.now();
};

/**
 * Check if date is between two dates
 */
export const isBetween = (
    date: string | Date,
    startDate: string | Date,
    endDate: string | Date
): boolean => {
    const d = toDate(date).getTime();
    const start = toDate(startDate).getTime();
    const end = toDate(endDate).getTime();
    return d >= start && d <= end;
};

/**
 * Get difference between two dates in specified unit
 */
export const getDifference = (
    date1: string | Date,
    date2: string | Date,
    unit: TimeUnit = 'millisecond'
): number => {
    const d1 = toDate(date1).getTime();
    const d2 = toDate(date2).getTime();
    const diff = d1 - d2;

    switch (unit) {
        case 'millisecond':
            return diff;
        case 'second':
            return Math.floor(diff / 1000);
        case 'minute':
            return Math.floor(diff / (1000 * 60));
        case 'hour':
            return Math.floor(diff / (1000 * 60 * 60));
        case 'day':
            return Math.floor(diff / (1000 * 60 * 60 * 24));
        case 'week':
            return Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
        case 'month':
            const d1Date = toDate(date1);
            const d2Date = toDate(date2);
            return (d1Date.getFullYear() - d2Date.getFullYear()) * 12 + (d1Date.getMonth() - d2Date.getMonth());
        case 'year':
            return toDate(date1).getFullYear() - toDate(date2).getFullYear();
        default:
            return diff;
    }
};

/**
 * Get relative time (simplified version)
 */
export const getRelativeTime = (date: string | Date): string => {
    const d = toDate(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
        return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else if (diffHour > 0) {
        return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffMin > 0) {
        return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else {
        return 'just now';
    }
};

/**
 * Check if year is leap year
 */
export const isLeapYear = (year?: number): boolean => {
    const targetYear = year || new Date().getFullYear();
    return (targetYear % 4 === 0 && targetYear % 100 !== 0) || (targetYear % 400 === 0);
};

/**
 * Get days in month
 */
export const getDaysInMonth = (date: string | Date): number => {
    const d = toDate(date);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
};

/**
 * Get age from birth date
 */
export const getAge = (birthDate: string | Date): number => {
    return getDifference(new Date(), birthDate, 'year');
};

/**
 * Check if date is weekend
 */
export const isWeekend = (date: string | Date): boolean => {
    const day = toDate(date).getDay();
    return day === 0 || day === 6; // Sunday or Saturday
};

/**
 * Check if date is weekday
 */
export const isWeekday = (date: string | Date): boolean => {
    return !isWeekend(date);
};

/**
 * Get next business day
 */
export const getNextBusinessDay = (date: string | Date): Date => {
    let nextDay = addTime(date, 1, 'day');
    while (isWeekend(nextDay)) {
        nextDay = addTime(nextDay, 1, 'day');
    }
    return nextDay;
};

/**
 * Get previous business day
 */
export const getPreviousBusinessDay = (date: string | Date): Date => {
    let prevDay = subtractTime(date, 1, 'day');
    while (isWeekend(prevDay)) {
        prevDay = subtractTime(prevDay, 1, 'day');
    }
    return prevDay;
};

/**
 * Format duration in human readable format
 */
export const formatDuration = (
    startDate: string | Date,
    endDate: string | Date
): string => {
    const diffMs = getDifference(endDate, startDate, 'millisecond');
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
};

/**
 * Get quarter of the year (1-4)
 */
export const getQuarter = (date: string | Date): number => {
    return Math.ceil((toDate(date).getMonth() + 1) / 3);
};

/**
 * Check if two dates are the same
 */
export const isSameDate = (
    date1: string | Date,
    date2: string | Date,
    unit: 'day' | 'month' | 'year' = 'day'
): boolean => {
    const d1 = toDate(date1);
    const d2 = toDate(date2);

    switch (unit) {
        case 'day':
            return d1.toDateString() === d2.toDateString();
        case 'month':
            return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
        case 'year':
            return d1.getFullYear() === d2.getFullYear();
        default:
            return d1.toDateString() === d2.toDateString();
    }
};

/**
 * Validate if string is a valid date
 */
export const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};

/**
 * Get hotel check-in time (default 3:00 PM)
 */
export const getCheckInTime = (
    date: string | Date,
    hour: number = 15,
    minute: number = 0
): Date => {
    const d = toDate(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour, minute, 0, 0);
};

/**
 * Get hotel check-out time (default 11:00 AM)
 */
export const getCheckOutTime = (
    date: string | Date,
    hour: number = 11,
    minute: number = 0
): Date => {
    const d = toDate(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour, minute, 0, 0);
};

/**
 * Calculate number of nights between check-in and check-out
 */
export const calculateNights = (
    checkIn: string | Date,
    checkOut: string | Date
): number => {
    return getDifference(checkOut, checkIn, 'day');
};

/**
 * Get reservation date range with proper check-in/check-out times
 */
export const getReservationDateRange = (
    checkInDate: string | Date,
    checkOutDate: string | Date
): { checkIn: Date; checkOut: Date; nights: number } => {
    const checkIn = getCheckInTime(checkInDate);
    const checkOut = getCheckOutTime(checkOutDate);
    const nights = calculateNights(checkIn, checkOut);

    return { checkIn, checkOut, nights };
};

/**
 * Format date for API response
 */
export const formatForAPI = (date: string | Date): string => {
    return formatDate(toDate(date), DateTimeFormat.API_DATETIME);
};

/**
 * Format date for reports
 */
export const formatForReport = (
    date: string | Date,
    includeTime: boolean = false
): string => {
    return formatDate(toDate(date),
        includeTime ? DateTimeFormat.REPORT_DATETIME : DateTimeFormat.REPORT_DATE
    );
};

/**
 * Generate filename timestamp
 */
export const generateFilenameTimestamp = (date?: string | Date): string => {
    return formatDate(toDate(date || new Date()), DateTimeFormat.REPORT_FILENAME);
};

/**
 * Format for logging
 */
export const formatForLog = (
    date: string | Date,
    includeMilliseconds: boolean = true
): string => {
    return formatDate(toDate(date),
        includeMilliseconds ? DateTimeFormat.LOG_TIMESTAMP : DateTimeFormat.DATETIME_DEFAULT
    );
};

/**
 * Format date for hotel reservation display
 */
export const formatForReservation = (date: string | Date): string => {
    return formatDate(toDate(date), DateTimeFormat.RESERVATION_DATE);
};

/**
 * Format time for hotel reservation display
 */
export const formatReservationTime = (date: string | Date): string => {
    return formatDate(toDate(date), DateTimeFormat.RESERVATION_TIME);
};

/**
 * Format date in US format
 */
export const formatUSDate = (date: string | Date): string => {
    return formatDate(toDate(date), DateTimeFormat.DATE_US);
};

/**
 * Format date in European format
 */
export const formatEUDate = (date: string | Date): string => {
    return formatDate(toDate(date), DateTimeFormat.DATE_EU);
};

/**
 * Format date with slashes
 */
export const formatDateSlash = (date: string | Date): string => {
    return formatDate(toDate(date), DateTimeFormat.DATE_SLASH);
};

/**
 * Format full date and time for display
 */
export const formatFullDateTime = (date: string | Date): string => {
    return formatDate(toDate(date), DateTimeFormat.DATETIME_FULL);
};

/**
 * Format compact date for mobile/small screens
 */
export const formatCompactDate = (date: string | Date): string => {
    return formatDate(toDate(date), DateTimeFormat.DISPLAY_DATE_COMPACT);
};