export interface Category {
  id: number;
  name: string;
  icon: string | null;
}

export interface SheetSummary {
  id: number;
  name: string;
  month: number;
  year: number;
  income: number;
  expense: number;
  balance: number;
}
