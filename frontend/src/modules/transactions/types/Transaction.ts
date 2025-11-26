export interface Transaction {
  id: number;
  sheet_id: number | null;
  origin: "sheet" | "transaction";
  type: "income" | "expense";

  description: string | null;
  value: number;
  date: string | null;
  paid_at: string | null;

  category: {
    id: number;
    name: string;
    icon?: string;
  } | null;

  bank: {
    id: number;
    name: string;
  } | null;

  raw: any;
}
