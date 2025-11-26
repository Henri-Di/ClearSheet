import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import { motion } from "framer-motion";

import type { MonthlyData } from "../types/dashboard";

interface Props {
  data: MonthlyData[] | null | undefined;
}

export function MonthlyBarChart({ data }: Props) {
  const safe = Array.isArray(data) ? data : [];

  return (
    <motion.div
      className="w-full h-[280px]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={safe}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7B61FF" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#7B61FF" stopOpacity={0.55} />
            </linearGradient>

            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E76BA3" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#E76BA3" stopOpacity={0.55} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#EFEAFE"
            className="dark:stroke-dark-border transition-colors duration-300"
          />

          <XAxis
            dataKey="month"
            stroke="#6B6A75"
            tick={{ fill: "#6B6A75" }}
            className="dark:stroke-gray-400 dark:fill-gray-400 transition-colors duration-300"
          />

          <YAxis
            stroke="#6B6A75"
            tick={{ fill: "#6B6A75" }}
            className="dark:stroke-gray-400 dark:fill-gray-400 transition-colors duration-300"
          />

          <Tooltip
            contentStyle={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(8px)",
              borderRadius: "12px",
              border: "1px solid #E6E1F7",
              padding: "10px 14px",
              color: "#2F2F36"
            }}
            wrapperClassName="dark:!bg-dark-card/90 dark:!border-dark-border"
            labelStyle={{ color: "#7B61FF", fontWeight: 600 }}
          />

          <Legend />

          <Bar
            dataKey="income"
            name="Entradas"
            fill="url(#incomeGrad)"
            radius={[10, 10, 0, 0]}
            animationDuration={900}
            animationEasing="ease-out"
            onMouseEnter={(_props, _index, e) => {
              const el = e.target as unknown as SVGElement;
              el.style.filter = "brightness(1.2) drop-shadow(0 4px 6px rgba(0,0,0,0.15))";
              el.style.transition = "0.25s ease";
            }}
            onMouseLeave={(_props, _index, e) => {
              const el = e.target as unknown as SVGElement;
              el.style.filter = "brightness(1)";
            }}
          />

          <Bar
            dataKey="expense"
            name="Saídas"
            fill="url(#expenseGrad)"
            radius={[10, 10, 0, 0]}
            animationDuration={900}
            animationEasing="ease-out"
            onMouseEnter={(_props, _index, e) => {
              const el = e.target as unknown as SVGElement;
              el.style.filter = "brightness(1.2) drop-shadow(0 4px 6px rgba(0,0,0,0.15))";
              el.style.transition = "0.25s ease";
            }}
            onMouseLeave={(_props, _index, e) => {
              const el = e.target as unknown as SVGElement;
              el.style.filter = "brightness(1)";
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
