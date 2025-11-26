import type { LucideIcon } from "lucide-react";


export interface Sheet {
  id: number;
  name: string;
  description: string | null;
  month: number;
  year: number;
  initial_balance: number;
}


export interface Category {
  id: number;
  name: string;
  icon?: string | null;
}


export interface Bank {
  id: number;
  name: string;
}


export type ItemType = "income" | "expense";

export interface UnifiedItem {
  id: number;

  sheet_id: number | null; 

  value: number;

  type: ItemType;
  description: string | null;

  date: string | null;
  paid_at: string | null;

  category: Category | null;
  category_id?: number | null;

  bank: Bank | null;
  bank_id?: number | null;

 
  origin: "sheet" | "transaction";


  raw: any;
}


export interface ItemFormState {
  type: ItemType;
  value: string;
  category_id: string;
  bank_id: string;
  description: string;
  date: string;
  paid_at: string;
}


export type SortField =
  | "date"
  | "value"
  | "category"
  | "type"
  | "origin"
  | "bank";

export type SortDirection = "asc" | "desc";


export interface CategoryIconMap {
  value: string;
  label: string;
  Icon: LucideIcon;
}
