export interface Sheet {
  id: number;
  name: string;
  description?: string | null;
  month: number;
  year: number;
  initial_balance: number;
}

export interface SheetSummary {
  entradas: number;
  saidas: number;
  initial: number;
  saldo_final: number;
}
