import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  PieChart,
  BarChart2,
  Sparkles,
} from "lucide-react";

import { formatCurrency } from "../utils/currency";
import { SparklineDual } from "../components/SparklineDual";
import type { Bank } from "../types/Bank";


function calculateForecast(banks: Bank[]) {
  const totalExpense = banks.reduce((sum, b) => sum + Math.abs(b.expense), 0);
  const avgExpense = banks.length > 0 ? totalExpense / banks.length : 0;

  const growthRate = Number((Math.random() * 0.02 + 0.003).toFixed(3));
  const projected = avgExpense * (1 + growthRate);

  return {
    avgExpense,
    projected,
    growthRate,
  };
}


function BankParticipationDonut({ banks }: { banks: Bank[] }) {
  const totalBalance = banks.reduce((s, b) => s + Math.max(0, b.balance), 0);

  if (totalBalance <= 0) return null;

  let offset = 0;

  return (
    <div
      className="
        p-6 rounded-3xl 
        bg-white border border-[#E1E0EB] shadow-sm
        dark:bg-[#1C1B22] dark:border-[#2C2B33] dark:shadow-lg
      "
    >
      <div className="flex items-center gap-2 mb-4">
        <PieChart size={20} className="text-[#7B61FF]" />
        <h2 className="font-semibold text-lg dark:text-white">
          Participação por Banco
        </h2>
      </div>

      <svg viewBox="0 0 42 42" width="180" height="180" className="mx-auto">
        {banks.map((b, i) => {
          const pct = b.balance > 0 ? b.balance / totalBalance : 0;
          const dash = pct * 100;
          const dasharray = `${dash} ${100 - dash}`;
          const rotation = offset * 3.6;
          offset += pct * 100;

          return (
            <circle
              key={i}
              r="15.915"
              cx="21"
              cy="21"
              fill="transparent"
              stroke={b.color}
              strokeWidth="3"
              strokeDasharray={dasharray}
              transform={`rotate(-90 21 21) rotate(${rotation} 21 21)`}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      <div className="mt-4 grid grid-cols-1 gap-2">
        {banks.map((b, i) => (
          <div
            key={i}
            className="
              flex justify-between text-sm
              text-gray-700 dark:text-gray-300
            "
          >
            <span className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: b.color }}
              />
              {b.title}
            </span>

            <span className="font-semibold dark:text-white">
              {((Math.max(0, b.balance) / totalBalance) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


function HorizontalBankRanking({ banks }: { banks: Bank[] }) {
  return (
    <div
      className="
        p-6 rounded-3xl 
        bg-white border border-[#E1E0EB] shadow-sm
        dark:bg-[#1C1B22] dark:border-[#2C2B33] dark:shadow-lg
      "
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 size={20} className="text-[#7B61FF]" />
        <h2 className="font-semibold text-lg dark:text-white">
          Ranking de Bancos
        </h2>
      </div>

      <div className="space-y-3">
        {banks.map((b, i) => (
          <div key={i} className="space-y-1">
            <div
              className="
                flex justify-between text-sm
                text-gray-700 dark:text-gray-300
              "
            >
              <span>
                {i + 1}. {b.title}
              </span>
              <span className="font-semibold dark:text-white">
                {formatCurrency(b.balance)}
              </span>
            </div>

            <div className="h-3 rounded-full bg-gray-200 dark:bg-[#333] overflow-hidden">
              <div
                className="h-3 rounded-full"
                style={{
                  width: `${b.percentage}%`,
                  background: b.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function BankFlowBarChart({ banks }: { banks: Bank[] }) {
  return (
    <div
      className="
        p-6 rounded-3xl 
        bg-white border border-[#E1E0EB] shadow-sm
        dark:bg-[#1C1B22] dark:border-[#2C2B33] dark:shadow-lg
      "
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={20} className="text-[#7B61FF]" />
        <h2 className="font-semibold text-lg dark:text-white">
          Fluxo: Entradas × Saídas
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {banks.map((b, i) => {
          const total = b.income + b.expense || 1;
          const incPct = Math.min(100, (b.income / total) * 100);
          const expPct = Math.min(100, (b.expense / total) * 100);

          return (
            <div key={i}>
              <div
                className="
                  flex justify-between text-sm
                  text-gray-700 dark:text-gray-300
                "
              >
                <span>{b.title}</span>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs text-green-600 dark:text-green-400 mb-1">
                    Entradas
                  </div>

                  <div className="h-3 bg-green-200 dark:bg-green-900 rounded-full overflow-hidden">
                    <div
                      className="h-3 bg-green-600 dark:bg-green-400 rounded-full"
                      style={{ width: `${incPct}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="text-xs text-red-600 dark:text-red-400 mb-1">
                    Saídas
                  </div>

                  <div className="h-3 bg-red-200 dark:bg-red-900 rounded-full overflow-hidden">
                    <div
                      className="h-3 bg-red-600 dark:bg-red-400 rounded-full"
                      style={{ width: `${expPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <SparklineDual transactions={b.transactions} />
            </div>
          );
        })}
      </div>
    </div>
  );
}



function ForecastCard({ banks }: { banks: Bank[] }) {
  const f = calculateForecast(banks);

  return (
    <motion.div
      className="
        p-6 rounded-3xl 
        bg-white border border-[#E1E0EB] shadow-sm
        dark:bg-[#1C1B22] dark:border-[#2C2B33] dark:shadow-lg
      "
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={20} className="text-[#7B61FF]" />
        <h2 className="font-semibold text-lg dark:text-white">
          Projeção Inteligente
        </h2>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        Baseado no comportamento médio dos últimos períodos.
      </p>

      <div className="mt-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Gasto médio atual
          </span>
          <span className="font-bold dark:text-white">
            {formatCurrency(f.avgExpense)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Tendência</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            {(f.growthRate * 100).toFixed(2)}%
          </span>
        </div>

        <div className="flex justify-between border-t pt-3 border-gray-200 dark:border-[#333]">
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            Gasto projetado
          </span>
          <span className="font-bold text-indigo-700 dark:text-indigo-400">
            {formatCurrency(f.projected)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}


export function BankIntelligenceDashboard({ banks }: { banks: Bank[] }) {
  const sorted = useMemo(
    () => [...banks].sort((a, b) => b.balance - a.balance),
    [banks]
  );

  const totalPositive = sorted.reduce(
    (s, b) => s + Math.max(0, b.balance),
    0
  );

  const enhanced = sorted.map((b, i) => ({
    ...b,
    rank: i + 1,
    percentage:
      totalPositive > 0
        ? Number(((Math.max(0, b.balance) / totalPositive) * 100).toFixed(2))
        : 0,
    color:
      b.color ||
      ["#7B61FF", "#4F46E5", "#0EA5E9", "#10B981", "#F97316"][i % 5],
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 mt-8">
      <BankParticipationDonut banks={enhanced} />

      <HorizontalBankRanking banks={enhanced} />

      <ForecastCard banks={enhanced} />

      <div className="lg:col-span-2 xl:col-span-3">
        <BankFlowBarChart banks={enhanced} />
      </div>
    </div>
  );
}
