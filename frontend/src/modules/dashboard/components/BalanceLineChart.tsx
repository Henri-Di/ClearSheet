import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { motion } from "framer-motion";
import type { BalanceData } from "../types/dashboard";

interface Props {
  data: BalanceData[] | null | undefined;
}

export function BalanceLineChart({ data }: Props) {
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
        <LineChart data={safe}>
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7B61FF" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#7B61FF" stopOpacity={0.4} />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
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
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              border: "1px solid #E6E1F7",
              color: "#2F2F36",
              padding: "10px 14px",
            }}
            wrapperClassName="dark:!bg-dark-card/80 dark:backdrop-blur-md dark:!border-dark-border"
            labelStyle={{ color: "#7B61FF", fontWeight: 600 }}
          />

          <Line
            type="monotone"
            dataKey="balance"
            stroke="url(#lineGrad)"
            strokeWidth={4}
            filter="url(#glow)"
            dot={{
              r: 6,
              fill: "#7B61FF",
              stroke: "white",
              strokeWidth: 2,
              className:
                "transition-transform duration-200 hover:scale-125",
            }}
            activeDot={{
              r: 10,
              style: {
                filter: "drop-shadow(0 0 10px #7B61FF)",
              },
            }}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
