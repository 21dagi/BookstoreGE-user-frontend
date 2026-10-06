import { LanguageCode } from '@/shared/types';

/**
 * Formats a numeric amount into Ethiopian Birr representation.
 * @param amount - Number representing amount in ETB
 * @param lang - 'am' (ብር) or 'en' (ETB)
 * @param options - Formatting options
 */
export function formatMoney(
  amount: number | string | null | undefined,
  lang: LanguageCode = 'am',
  options: {
    showCurrency?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {},
): string {
  const {
    showCurrency = true,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  const numericValue = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0);
  const safeValue = isNaN(numericValue) ? 0 : numericValue;

  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(safeValue);

  if (!showCurrency) {
    return formattedNumber;
  }

  const currencySymbol = lang === 'am' ? 'ብር' : 'ETB';
  return lang === 'am' ? `${formattedNumber} ${currencySymbol}` : `${currencySymbol} ${formattedNumber}`;
}

/**
 * Calculates spendable balance.
 * Business Rule: Pending deposits are NEVER added to spendable balance.
 */
export function calculateSpendableBalance(
  confirmedGeneralBalance: number,
  confirmedEqubCreditBalance: number,
  includeEqubCredit: boolean = false,
): number {
  const safeGeneral = Math.max(0, confirmedGeneralBalance);
  const safeEqub = Math.max(0, confirmedEqubCreditBalance);
  return includeEqubCredit ? safeGeneral + safeEqub : safeGeneral;
}
