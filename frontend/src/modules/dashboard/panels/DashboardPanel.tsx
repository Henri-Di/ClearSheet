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
        <div className="h-10 rounded-xl w-64 bg-gray-200 dark:bg-[#1D1C22]"></div>

        <div className="grid grid-cols-4 gap-6">
          <div className="h-32 rounded-3xl bg-gray-200 dark:bg-[#1D1C22]"></div>
          <div className="h-32 rounded-3xl bg-gray-200 dark:bg-[#1D1C22]"></div>
          <div className="h-32 rounded-3xl bg-gray-200 dark:bg-[#1D1C22]"></div>
          <div className="h-32 rounded-3xl bg-gray-200 dark:bg-[#1D1C22]"></div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="h-80 rounded-3xl bg-gray-200 dark:bg-[#1D1C22]"></div>
          <div className="h-80 rounded-3xl bg-gray-200 dark:bg-[#1D1C22]"></div>
        </div>

        <div className="h-80 rounded-3xl bg-gray-200 dark:bg-[#1D1C22]"></div>
      </div>
    );
  }



  const totalEntradas = monthly.reduce((t, m) => t + (m.income ?? 0), 0);
  const totalSaidas = monthly.reduce((t, m) => t + (m.expense ?? 0), 0);
  const saldoFinal = balances?.[balances.length - 1]?.balance ?? 0;
  const economiaMedia =
    balances.length > 1
      ? (totalEntradas - totalSaidas) / balances.length
      : totalEntradas - totalSaidas;

  return (
    <div className="animate-fadeIn space-y-14 pb-20">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <BarChart3 size={32} className="text-primary" />
        <h1 className="font-display text-4xl font-semibold tracking-tight text-[#2F2F36] dark:text-white">
          Painel de Controle
        </h1>
      </div>


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
          <MonthlyBarChart data={monthly} />
        </ChartCard>

        <ChartCard title="Saldo Acumulado">
          <BalanceLineChart data={balances} />
        </ChartCard>
      </div>

    
      <ChartCard title="Distribuição por Categoria">
        <CategoriesPieChart2026 data={categoriesGraph} />
      </ChartCard>
    </div>
  );
}
