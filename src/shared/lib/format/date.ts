import { LanguageCode } from '@/shared/types';

export const ETHIOPIC_MONTHS = [
  'መስከረም',
  'ጥቅምት',
  'ኅዳር',
  'ታኅሣሥ',
  'ጥር',
  'የካቲት',
  'መጋቢት',
  'ሚያዝያ',
  'ግንቦት',
  'ሰኔ',
  'ሐምሌ',
  'ነሐሴ',
  'ጳጉሜን',
] as const;

export interface EthiopianDate {
  year: number;
  month: number; // 1 - 13
  day: number; // 1 - 30 (1 - 6 for Pagume)
}

/**
 * Converts a Gregorian Date object to an Ethiopian Calendar date.
 * Based on the established JDN (Julian Day Number) conversion algorithm.
 */
export function gregorianToEthiopian(gregorianDate: Date): EthiopianDate {
  const gYear = gregorianDate.getFullYear();
  const gMonth = gregorianDate.getMonth() + 1;
  const gDay = gregorianDate.getDate();

  // Calculate Julian Day Number from Gregorian Date
  const a = Math.floor((14 - gMonth) / 12);
  const y = gYear + 4800 - a;
  const m = gMonth + 12 * a - 3;

  const jdn =
    gDay +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  // Convert JDN to Ethiopian Date
  const r = (jdn - 1723856) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);

  const ethYear =
    4 * Math.floor((jdn - 1723856) / 1461) +
    Math.floor(r / 365) -
    Math.floor(r / 1460);
  const ethMonth = Math.floor(n / 30) + 1;
  const ethDay = (n % 30) + 1;

  return {
    year: ethYear,
    month: ethMonth,
    day: ethDay,
  };
}

/**
 * Formats a Date object into either Ethiopian or Gregorian formatted string.
 */
export function formatDate(
  dateInput: Date | string | number | null | undefined,
  lang: LanguageCode = 'am',
  formatType: 'date' | 'dateTime' | 'relative' = 'date',
): string {
  if (!dateInput) return '—';
  const date = typeof dateInput === 'string' || typeof dateInput === 'number'
    ? new Date(dateInput)
    : dateInput;

  if (isNaN(date.getTime())) return '—';

  if (formatType === 'relative') {
    return formatRelativeTime(date, lang);
  }

  if (lang === 'am') {
    const ethDate = gregorianToEthiopian(date);
    const monthName = ETHIOPIC_MONTHS[ethDate.month - 1] ?? '';
    const dateStr = `${monthName} ${ethDate.day}፣ ${ethDate.year} ዓ.ም.`;
    if (formatType === 'dateTime') {
      const hours = date.getHours().toString().padStart(2, '0');
      const mins = date.getMinutes().toString().padStart(2, '0');
      return `${dateStr} ${hours}:${mins}`;
    }
    return dateStr;
  }

  const options: Intl.DateTimeFormatOptions =
    formatType === 'dateTime'
      ? { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }
      : { month: 'short', day: 'numeric', year: 'numeric' };

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Formats relative time (e.g. 5 minutes ago / ከ 5 ደቂቃ በፊት).
 */
export function formatRelativeTime(date: Date, lang: LanguageCode = 'am'): string {
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) {
    return lang === 'am' ? 'አሁን' : 'just now';
  }
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return lang === 'am' ? `ከ ${diffMin} ደቂቃ በፊት` : `${diffMin}m ago`;
  }
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    return lang === 'am' ? `ከ ${diffHours} ሰዓት በፊት` : `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return lang === 'am' ? `ከ ${diffDays} ቀን በፊት` : `${diffDays}d ago`;
  }
  return formatDate(date, lang, 'date');
}
