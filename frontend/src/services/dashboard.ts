import { api } from "./api";

export interface DashboardStats {
  sheets: number;
  categories: number;
  transactions: number;
  users: number;
}

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
}

export async function fetchDashboardCounts(): Promise<DashboardStats> {
  const response = await api.get<{ data: DashboardStats }>("/dashboard/counts");
  return response.data.data;
}

export async function fetchDashboardMonthly(): Promise<MonthlyData[]> {
  const response = await api.get<{ data: MonthlyData[] }>("/dashboard/monthly");
  return response.data.data;
}

export async function fetchDashboardBalance(): Promise<BalanceData[]> {
  const response = await api.get<{ data: BalanceData[] }>("/dashboard/balance");
  return response.data.data;
}

export async function fetchDashboardCategories(): Promise<CategoryData[]> {
  const response = await api.get<{ data: CategoryData[] }>(
    "/dashboard/categories",
  );
  return response.data.data;
}
