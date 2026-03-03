export interface CurrencySummary {
  baseCurrency?: string;
  targetCurrency?: string;
  totalAll: number;
  totalUnpaid: number;
  totalPaid: number;
}