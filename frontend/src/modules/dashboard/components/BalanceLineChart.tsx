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
      className="w-full h-[300px]"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.012 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={safe} margin={{ top: 10, left: 0, right: 12, bottom: 0 }}>


          <defs>
 
            <linearGradient id="lineBalanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7B61FF" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#7B61FF" stopOpacity={0.35} />
            </linearGradient>

      
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#E7E3FF"
            className="dark:stroke-[#2C2A3C] transition-all duration-300"
          />

          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6B6A75", fontSize: 13 }}
            className="dark:fill-gray-400 transition-colors"
          />


          <YAxis
            width={60}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6B6A75", fontSize: 12 }}
            className="dark:fill-gray-400 transition-colors"
          />


          <Tooltip
            cursor={{
              stroke: "#7B61FF",
              strokeWidth: 1,
              strokeOpacity: 0.25,
            }}
            contentStyle={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(12px)",
              borderRadius: "14px",
              border: "1px solid #E6E1F7",
              padding: "12px 18px",
              boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
            }}
            wrapperClassName="
              dark:!bg-[#1A1825]/80 
              dark:!border-[#2A2733]
              dark:backdrop-blur-xl
              dark:text-gray-200
              rounded-xl
              transition-all
            "
            labelStyle={{
              color: "#7B61FF",
              fontWeight: 700,
              fontSize: 13,
              marginBottom: 6,
            }}
          />


          <Line
            type="monotone"
            dataKey="balance"
            stroke="url(#lineBalanceGrad)"
            strokeWidth={4}
            filter="url(#softGlow)"
            dot={{
              r: 6,
              fill: "#7B61FF",
              stroke: "white",
              strokeWidth: 2,
              className:
                "transition-all duration-200 hover:scale-125 dark:fill-[#A58AFF]",
            }}
            activeDot={{
              r: 10,
              style: {
                filter: "drop-shadow(0 0 16px #7B61FF)",
              },
            }}
            animationDuration={900}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
