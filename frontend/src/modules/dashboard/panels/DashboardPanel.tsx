import { useEffect, useState } from "react";
import { api } from "../../../services/api";

import {
  BarChart3,
  FileSpreadsheet,
  FolderTree,
  Receipt,
  Users,
} from "lucide-react";

import { DashboardCard } from "../components/DashboardCard";
import { ChartCard } from "../components/ChartCard";
import { OverviewRow } from "../components/OverviewRow";
import { DashboardFilters } from "../components/DashboardFilters";

import { MonthlyBarChart } from "../components/MonthlyBarChart";
import { BalanceLineChart } from "../components/BalanceLineChart";
import { CategoriesPieChart2026 } from "../components/CategoriesPieChart";

import type {
  MonthlyData,
  BalanceData,
  CategoryData,
} from "../types/dashboard";

export default function DashboardPanel() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    sheets: 0,
    categories: 0,
    transactions: 0,
    users: 0,
  });

  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [balances, setBalances] = useState<BalanceData[]>([]);
  const [categoriesGraph, setCategoriesGraph] = useState<CategoryData[]>([]);

  const [period, setPeriod] = useState("3m");
  const [typeFilter, setTypeFilter] = useState("all");
  const [order, setOrder] = useState("none");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  async function loadAll() {
    try {
      setLoading(true);

      const [countsRes, monthlyRes, balanceRes, categoriesRes] =
        await Promise.all([
          api.get("/dashboard/counts"),
          api.get("/dashboard/monthly"),
          api.get("/dashboard/balance"),
          api.get("/dashboard/categories"),
        ]);

      const c = countsRes.data.data;

      setStats({
        sheets: Number(c.sheets ?? 0),
        categories: Number(c.categories ?? 0),
        transactions: Number(c.transactions ?? 0),
        users: Number(c.users ?? 0),
      });

      const monthlyRaw = monthlyRes.data.data ?? [];
      const balanceRaw = balanceRes.data.data ?? [];
      const categoriesRaw = categoriesRes.data.data ?? [];

      setMonthly(
        monthlyRaw.map((m: any) => ({
          month:
            m.month ??
            m.mes ??
            (m.date
              ? new Date(m.date).toLocaleDateString("pt-BR", {
                  month: "short",
                }).toUpperCase()
              : ""),
          income: Number(m.income ?? m.entradas ?? m.total_in ?? 0),
          expense: Number(m.expense ?? m.saidas ?? m.total_out ?? 0),
        }))
      );

      setBalances(
        balanceRaw.map((b: any) => ({
          month:
            b.month ??
            b.mes ??
            (b.date
              ? new Date(b.date).toLocaleDateString("pt-BR", {
                  month: "short",
                }).toUpperCase()
              : ""),
          balance: Number(b.balance ?? b.saldo ?? b.total ?? 0),
        }))
      );

      setCategoriesGraph(
        categoriesRaw.map((c: any) => ({
          name: c.name ?? c.categoria ?? c.label ?? "Sem nome",
          total: Number(c.total ?? c.valor ?? c.amount ?? 0),
        }))
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  if (loading) {
    return (
      <div className="p-12 space-y-12">
        <div className="h-10 rounded-xl w-64 bg-gray-200 dark:bg-[#1D1C22]" />
        <div className="grid grid-cols-4 gap-6">
          <div className="h-32 rounded-3xl bg-gray-200 dark:bg-[#1D1C22]" />
          <div className="h-32 rounded-3xl bg-gray-200 dark:bg-[#1D1C22]" />
          <div className="h-32 rounded-3xl bg-gray-200 dark:bg-[#1D1C22]" />
          <div className="h-32 rounded-3xl bg-gray-200 dark:bg-[#1D1C22]" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="h-80 rounded-3xl bg-gray-200 dark:bg-[#1D1C22]" />
          <div className="h-80 rounded-3xl bg-gray-200 dark:bg-[#1D1C22]" />
        </div>
        <div className="h-80 rounded-3xl bg-gray-200 dark:bg-[#1D1C22]" />
      </div>
    );
  }

  function filterPeriod(list: any[]) {
    const now = new Date();
    if (period === "3m") return list.slice(-3);
    if (period === "6m") return list.slice(-6);
    if (period === "year")
      return list.filter((m) => {
        const d = new Date(`${m.month} 1, ${now.getFullYear()}`);
        return d.getFullYear() === now.getFullYear();
      });
    if (period === "lastyear")
      return list.filter((m) => {
        const d = new Date(`${m.month} 1, ${now.getFullYear() - 1}`);
        return d.getFullYear() === now.getFullYear() - 1;
      });
    return list;
  }

  function filterType(list: MonthlyData[]) {
    if (typeFilter === "income") return list.map((m) => ({ ...m, expense: 0 }));
    if (typeFilter === "expense") return list.map((m) => ({ ...m, income: 0 }));
    return list;
  }

  function filterCategories(list: CategoryData[]) {
    if (selectedCategories.length === 0) return list;
    return list.filter((c) =>
      selectedCategories.includes(String(c.name ?? "-"))
    );
  }

  function sortCategories(list: CategoryData[]) {
    if (order === "high") return [...list].sort((a, b) => b.total - a.total);
    if (order === "low") return [...list].sort((a, b) => a.total - b.total);
    if (order === "az")
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (order === "za")
      return [...list].sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }

  const monthlyFiltered = filterType(filterPeriod(monthly));
  const balancesFiltered = filterPeriod(balances);
  const categoriesFiltered = sortCategories(filterCategories(categoriesGraph));

  const totalEntradas = monthlyFiltered.reduce(
    (t, m) => t + (m.income ?? 0),
    0
  );
  const totalSaidas = monthlyFiltered.reduce(
    (t, m) => t + (m.expense ?? 0),
    0
  );
  const saldoFinal = balancesFiltered?.[balancesFiltered.length - 1]?.balance ?? 0;
  const economiaMedia =
    balancesFiltered.length > 1
      ? (totalEntradas - totalSaidas) / balancesFiltered.length
      : totalEntradas - totalSaidas;

  return (
    <div className="animate-fadeIn space-y-14 pb-20">
      <div className="flex items-center gap-3">
        <BarChart3 size={32} className="text-primary" />
        <h1 className="font-display text-4xl font-semibold tracking-tight text-[#2F2F36] dark:text-white">
          Painel de Controle
        </h1>
      </div>

      <DashboardFilters
        period={period}
        setPeriod={setPeriod}
        type={typeFilter}
        setType={setTypeFilter}
        order={order}
        setOrder={setOrder}
        categories={categoriesGraph}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />

      <OverviewRow
        saldo={saldoFinal}
        entradas={totalEntradas}
        saidas={totalSaidas}
        economia={economiaMedia}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <DashboardCard
          icon={<FileSpreadsheet size={26} />}
          iconBg="bg-[#EDE7FF] dark:bg-dark-card"
          title="Planilhas"
          value={stats.sheets}
        />
        <DashboardCard
          icon={<FolderTree size={26} />}
          iconBg="bg-[#F4E9FF] dark:bg-dark-card"
          title="Categorias"
          value={stats.categories}
        />
        <DashboardCard
          icon={<Receipt size={26} />}
          iconBg="bg-[#FCEEFF] dark:bg-dark-card"
          title="Transações"
          value={stats.transactions}
        />
        <DashboardCard
          icon={<Users size={26} />}
          iconBg="bg-[#EEF0FF] dark:bg-dark-card"
          title="Usuários"
          value={stats.users}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        <ChartCard title="Entradas e Saídas por Mês">
          <MonthlyBarChart data={monthlyFiltered} />
        </ChartCard>

        <ChartCard title="Saldo Acumulado">
          <BalanceLineChart data={balancesFiltered} />
        </ChartCard>
      </div>

      <ChartCard title="Distribuição por Categoria">
        <CategoriesPieChart2026 data={categoriesFiltered} />
      </ChartCard>
    </div>
  );
}
