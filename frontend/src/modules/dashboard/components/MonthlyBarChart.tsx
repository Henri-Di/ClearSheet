import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
      className="w-full h-[300px]"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.012 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={safe}
          barCategoryGap="18%"
          margin={{ top: 16, right: 12, left: 0, bottom: 5 }}
        >

          <defs>
            <linearGradient id="inGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7B61FF" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#7B61FF" stopOpacity={0.45} />
            </linearGradient>

            <linearGradient id="outGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E76BA3" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#E76BA3" stopOpacity={0.45} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#EDE8FB"
            className="dark:stroke-dark-border/40 transition-all duration-300"
          />

          <XAxis
            dataKey="month"
            tickMargin={8}
            stroke="#6B6A75"
            tick={{ fill: "#6B6A75", fontSize: 13 }}
            className="
              dark:stroke-gray-400 dark:fill-gray-400
              transition-colors duration-300
            "
          />

          <YAxis
            stroke="#6B6A75"
            tick={{ fill: "#6B6A75", fontSize: 12 }}
            className="
              dark:stroke-gray-400 dark:fill-gray-300
              transition-colors duration-300
            "
          />

          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(10px)",
              borderRadius: "14px",
              border: "1px solid #E6E1F7",
              padding: "12px 16px",
              color: "#2F2F36",
            }}
            wrapperClassName="
              dark:!bg-dark-card/90 dark:!border-dark-border
              dark:!text-gray-200 
            "
            labelStyle={{
              color: "#7B61FF",
              fontWeight: 600,
              marginBottom: 6,
            }}
          />


          <Legend
            iconType="circle"
            formatter={(value) => (
              <span className="text-sm text-[#5A556A] dark:text-gray-300">
                {value}
              </span>
            )}
          />


          <Bar
            dataKey="income"
            name="Entradas"
            fill="url(#inGrad)"
            radius={[10, 10, 0, 0]}
            animationDuration={900}
            animationEasing="ease-out"
            onMouseEnter={(_, __, e) => {
              const el = e?.target as SVGElement;
              if (el) {
                el.style.filter =
                  "brightness(1.22) drop-shadow(0px 4px 8px rgba(0,0,0,0.18))";
                el.style.transition = "0.25s ease";
              }
            }}
            onMouseLeave={(_, __, e) => {
              const el = e?.target as SVGElement;
              if (el) {
                el.style.filter = "brightness(1)";
              }
            }}
          />

          <Bar
            dataKey="expense"
            name="Saídas"
            fill="url(#outGrad)"
            radius={[10, 10, 0, 0]}
            animationDuration={900}
            animationEasing="ease-out"
            onMouseEnter={(_, __, e) => {
              const el = e?.target as SVGElement;
              if (el) {
                el.style.filter =
                  "brightness(1.22) drop-shadow(0px 4px 8px rgba(0,0,0,0.18))";
                el.style.transition = "0.25s ease";
              }
            }}
            onMouseLeave={(_, __, e) => {
              const el = e?.target as SVGElement;
              if (el) {
                el.style.filter = "brightness(1)";
              }
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
