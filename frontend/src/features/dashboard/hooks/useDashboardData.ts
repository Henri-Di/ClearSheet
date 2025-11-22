import { useCallback, useEffect, useState } from "react";
import {
  BalanceData,
  CategoryData,
  DashboardStats,
  MonthlyData,
  fetchDashboardBalance,
  fetchDashboardCategories,
  fetchDashboardCounts,
  fetchDashboardMonthly,
} from "../../../services/dashboard";

interface DashboardData {
  stats: DashboardStats;
  monthly: MonthlyData[];
  balances: BalanceData[];
  categoriesGraph: CategoryData[];
}

interface UseDashboardDataResponse {
  data: DashboardData;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const initialData: DashboardData = {
  stats: {
    sheets: 0,
    categories: 0,
    transactions: 0,
    users: 0,
  },
  monthly: [],
  balances: [],
  categoriesGraph: [],
};

export function useDashboardData(): UseDashboardDataResponse {
  const [data, setData] = useState<DashboardData>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [counts, monthly, balances, categoriesGraph] = await Promise.all([
        fetchDashboardCounts(),
        fetchDashboardMonthly(),
        fetchDashboardBalance(),
        fetchDashboardCategories(),
      ]);

      setData({
        stats: counts,
        monthly,
        balances,
        categoriesGraph,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar dashboard";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return { data, isLoading, error, refetch: loadAll };
}
