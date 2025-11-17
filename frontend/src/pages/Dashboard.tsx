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
      <div className="p-12 animate-pulse space-y-12">
        <div className="h-10 bg-gray-200 rounded-xl w-64"></div>

        <div className="grid grid-cols-4 gap-6">
          <div className="h-32 bg-gray-200 rounded-3xl"></div>
          <div className="h-32 bg-gray-200 rounded-3xl"></div>
          <div className="h-32 bg-gray-200 rounded-3xl"></div>
          <div className="h-32 bg-gray-200 rounded-3xl"></div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="h-80 bg-gray-200 rounded-3xl"></div>
          <div className="h-80 bg-gray-200 rounded-3xl"></div>
        </div>

        <div className="h-80 bg-gray-200 rounded-3xl"></div>
      </div>
    );
  }

  // ========================================================
  // VIEW — PREMIUM DASHBOARD
  // ========================================================
  return (
    <div className="animate-fadeIn space-y-14 pb-20">
      {/* TITLE */}
      <div className="flex items-center gap-3">
        <BarChart3 size={32} className="text-[#7B61FF]" />
        <h1 className="font-display text-4xl font-semibold text-[#2F2F36] tracking-tight">
          Painel de Controle
        </h1>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <DashboardCard
          icon={<FileSpreadsheet size={26} />}
          iconBg="bg-[#EDE7FF]"
          title="Planilhas"
          value={stats.sheets}
        />

        <DashboardCard
          icon={<FolderTree size={26} />}
          iconBg="bg-[#F4E9FF]"
          title="Categorias"
          value={stats.categories}
        />

        <DashboardCard
          icon={<Receipt size={26} />}
          iconBg="bg-[#FCEEFF]"
          title="Transações"
          value={stats.transactions}
        />

        <DashboardCard
          icon={<Users size={26} />}
          iconBg="bg-[#EEF0FF]"
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

// ========================================================
// CARD COMPONENT
// ========================================================
interface CardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: number;
}

function DashboardCard({ icon, iconBg, title, value }: CardProps) {
  return (
    <div
      className="
        bg-white p-6 rounded-3xl border border-[#E6E1F7]
        shadow-sm hover:shadow-md hover:-translate-y-1
        transition-all cursor-default relative
      "
    >
      <div
        className={`
          absolute -top-4 left-4 p-3 rounded-2xl shadow-sm border border-white
          ${iconBg}
        `}
      >
        {icon}
      </div>

      <div className="mt-6">
        <p className="text-sm text-[#5A556A] font-medium mb-1">{title}</p>
        <h3 className="text-4xl font-display font-semibold text-[#2F2F36] tracking-tight">
          {value}
        </h3>
      </div>
    </div>
  );
}

// ========================================================
// CHART CARD
// ========================================================
interface ChartCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function ChartCard({ title, icon, children }: ChartCardProps) {
  return (
    <div className="bg-white border border-[#E6E1F7] rounded-3xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-lg font-semibold text-[#2F2F36]">
          {title}
        </h2>
      </div>

      {children}
    </div>
  );
}
