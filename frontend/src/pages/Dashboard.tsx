import { useEffect, useState } from "react";
import { api } from "../services/api";

import {
  FileSpreadsheet,
  FolderTree,
  Receipt,
  Users,
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
} from "lucide-react";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

import { ChartCard } from "../components/ui/ChartCard";
import { PageHeader } from "../components/ui/PageHeader";
import { Skeleton } from "../components/ui/Skeleton";
import { StatBadge } from "../components/ui/StatBadge";

// ========================================================
// TYPES
// ========================================================
export interface ChartRow {
  [key: string]: string | number;
}

export interface MonthlyData extends ChartRow {
  month: string;
  income: number;
  expense: number;
}

export interface BalanceData extends ChartRow {
  month: string;
  balance: number;
}

export interface CategoryData extends ChartRow {
  name: string;
  total: number;
}

// ========================================================
// COLORS
// ========================================================
const COLORS = ["#7B61FF", "#E76BA3", "#2F4A8A", "#A680FF", "#FFB672"];

// ========================================================
// COMPONENT
// ========================================================
export default function Dashboard() {
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
        sheets: c.sheets,
        categories: c.categories,
        transactions: c.transactions,
        users: c.users,
      });

      setMonthly(monthlyRes.data.data);
      setBalances(balanceRes.data.data);
      setCategoriesGraph(categoriesRes.data.data);
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  // ========================================================
  // VIEW — LOADING SKELETON
  // ========================================================
  if (loading) {
    return (
      <div className="p-12 space-y-12">
        <Skeleton className="h-10 w-64" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-3xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-3xl" />
          <Skeleton className="h-80 rounded-3xl" />
        </div>

        <Skeleton className="h-80 rounded-3xl" />
      </div>
    );
  }

  // ========================================================
  // VIEW — PREMIUM DASHBOARD
  // ========================================================
  return (
    <div className="animate-fadeIn space-y-14 pb-20">
      <PageHeader
        title="Painel de Controle"
        icon={<BarChart3 size={28} />}
        subtitle="Visão geral das suas finanças e categorias."
      />

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatBadge
          icon={<FileSpreadsheet size={26} />}
          iconBgClassName="bg-[#EDE7FF]"
          title="Planilhas"
          value={stats.sheets}
        />

        <StatBadge
          icon={<FolderTree size={26} />}
          iconBgClassName="bg-[#F4E9FF]"
          title="Categorias"
          value={stats.categories}
        />

        <StatBadge
          icon={<Receipt size={26} />}
          iconBgClassName="bg-[#FCEEFF]"
          title="Transações"
          value={stats.transactions}
        />

        <StatBadge
          icon={<Users size={26} />}
          iconBgClassName="bg-[#EEF0FF]"
          title="Usuários"
          value={stats.users}
        />
      </div>

      {/* GRAPH GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* BAR CHART */}
        <ChartCard
          title="Entradas e Saídas por Mês"
          icon={<BarChart3 className="text-[#7B61FF]" size={20} />}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EFEAFE" />
              <XAxis dataKey="month" stroke="#6B6A75" />
              <YAxis stroke="#6B6A75" />
              <Tooltip />
              <Legend />

              <Bar dataKey="income" name="Entradas" fill="#7B61FF" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expense" name="Saídas" fill="#E76BA3" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* LINE CHART */}
        <ChartCard
          title="Saldo Acumulado Mensal"
          icon={<TrendingUp className="text-[#7B61FF]" size={20} />}
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={balances}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EFEAFE" />
              <XAxis dataKey="month" stroke="#6B6A75" />
              <YAxis stroke="#6B6A75" />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="balance"
                stroke="#7B61FF"
                strokeWidth={3}
                dot={{ strokeWidth: 2, r: 4 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* PIE CHART */}
      <ChartCard
        title="Distribuição por Categoria"
        icon={<PieIcon className="text-[#7B61FF]" size={20} />}
      >
        {categoriesGraph.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum dado para exibir.</p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Tooltip />

              <Pie
                data={categoriesGraph}
                dataKey="total"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={(props: any) => {
                  if (!props || typeof props.value !== "number") return "";
                  return `${props.name}: R$ ${props.value.toFixed(2)}`;
                }}
              >
                {categoriesGraph.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}

