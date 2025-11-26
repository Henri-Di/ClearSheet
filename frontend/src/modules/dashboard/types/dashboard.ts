export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface BalanceData {
  month: string;
  balance: number;
}

export interface CategoryData {
  name: string;
  total: number;
  [key: string]: string | number;
}
