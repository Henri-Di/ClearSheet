import { useDashboardData } from "../features/dashboard/hooks/useDashboardData";

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
// COLORS
// ========================================================
const COLORS = ["#7B61FF", "#E76BA3", "#2F4A8A", "#A680FF", "#FFB672"];

// ========================================================
// COMPONENT
// ========================================================
export default function Dashboard() {
  const { data, isLoading, error, refetch } = useDashboardData();

  const { stats, monthly, balances, categoriesGraph } = data;

  // ========================================================
  // VIEW — LOADING SKELETON
  // ========================================================
  if (isLoading) {
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

  if (error) {
    return (
      <div className="p-12 space-y-6">
        <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl">
          <p className="font-semibold">Não foi possível carregar o painel.</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>

        <button
          onClick={refetch}
          className="px-4 py-2 bg-[#7B61FF] text-white rounded-lg hover:brightness-110 transition"
        >
          Tentar novamente
        </button>
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
                label={({ name, value }: { name?: string; value?: number }) => {
                  if (typeof value !== "number" || typeof name !== "string") return "";
                  return `${name}: R$ ${value.toFixed(2)}`;
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

