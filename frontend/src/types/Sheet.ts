export interface Sheet {
  id: number;
  name: string;
  description?: string;
  month: number;
  year: number;
  initial_balance: number;
  created_at: string;
}
