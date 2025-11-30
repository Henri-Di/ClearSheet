import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet2,
  PiggyBank,
} from "lucide-react";

import { formatCurrency } from "../../sheetView/utils/currency";
import type { JSX } from "react/jsx-runtime";


interface KPI {
  title: string;
  value: number | string;
  icon: JSX.Element;
  color: string;
  bg: string; 
  glow: string; 
  barColor: string; 
}

interface Props {
  saldo: number;
  entradas: number;
  saidas: number;
  economia?: number;
}


export function OverviewRow({ saldo, entradas, saidas, economia }: Props) {
  const cards: KPI[] = [
    {
      title: "Entradas",
      value: formatCurrency(entradas),
      icon: <TrendingUp size={20} className="text-green-500 dark:text-green-300" />,
      color: "text-green-600 dark:text-green-300",
      bg: "from-green-50/60 to-green-100/30 dark:from-green-900/20 dark:to-green-900/10",
      glow: "shadow-[0_0_14px_-2px_rgba(16,185,129,0.45)]",
      barColor: "bg-green-500",
    },
    {
      title: "Saídas",
      value: formatCurrency(saidas),
      icon: <TrendingDown size={20} className="text-red-500 dark:text-red-300" />,
      color: "text-red-600 dark:text-red-300",
      bg: "from-red-50/60 to-red-100/30 dark:from-red-900/20 dark:to-red-900/10",
      glow: "shadow-[0_0_14px_-2px_rgba(239,68,68,0.4)]",
      barColor: "bg-red-500",
    },
    {
      title: "Saldo Atual",
      value: formatCurrency(saldo),
      icon: <Wallet2 size={20} className="text-indigo-500 dark:text-indigo-300" />,
      color:
        saldo >= 0
          ? "text-indigo-600 dark:text-indigo-300"
          : "text-red-500 dark:text-red-300",
      bg:
        saldo >= 0
          ? "from-indigo-50/60 to-indigo-100/30 dark:from-indigo-900/20 dark:to-indigo-900/10"
          : "from-red-50/60 to-red-100/30 dark:from-red-900/20 dark:to-red-900/10",
      glow:
        saldo >= 0
          ? "shadow-[0_0_14px_-2px_rgba(99,102,241,0.45)]"
          : "shadow-[0_0_14px_-2px_rgba(239,68,68,0.45)]",
      barColor: saldo >= 0 ? "bg-indigo-500" : "bg-red-500",
    },
    economia !== undefined && {
      title: "Economia / Mês",
      value: formatCurrency(economia),
      icon: <PiggyBank size={20} className="text-emerald-500 dark:text-emerald-300" />,
      color: "text-emerald-600 dark:text-emerald-300",
      bg: "from-emerald-50/60 to-emerald-100/30 dark:from-emerald-900/20 dark:to-emerald-900/10",
      glow: "shadow-[0_0_14px_-2px_rgba(16,185,129,0.45)]",
      barColor: "bg-emerald-500",
    },
  ].filter(Boolean) as KPI[];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.08 },
        },
      }}
      className="
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 
        gap-6 w-full mb-10
      "
    >
      {cards.map((card, i) => (
        <OverviewItem key={i} {...card} />
      ))}
    </motion.div>
  );
}


function OverviewItem({ title, value, icon, color, bg, glow, barColor }: KPI) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{
        scale: 1.025,
        y: -4,
        boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
      }}
      transition={{ duration: 0.38 }}
      className={`
        rounded-3xl px-6 py-5
        bg-gradient-to-br ${bg}
        border border-white/30 dark:border-white/10
        shadow-lg backdrop-blur-xl relative overflow-hidden

        ${glow}
      `}
    >
    
      <div
        className="
          absolute left-4 top-4 w-10 h-10 
          bg-white/40 dark:bg-white/10
          blur-xl rounded-full
        "
      />

 
      <motion.div
        className="
          relative z-10 p-3 rounded-2xl 
          bg-white/70 dark:bg-white/10
          border border-white/40 dark:border-white/10
          shadow-md backdrop-blur-xl
          flex items-center justify-center
        "
        whileHover={{ scale: 1.12, rotate: 2 }}
        transition={{ duration: 0.25 }}
      >
        {icon}
      </motion.div>

   
      <div className="text-right mt-4 relative z-10">
        <p className="text-sm text-[#5A556A] dark:text-gray-300 font-medium tracking-wide">
          {title}
        </p>

        <p
          className={`
            text-3xl font-semibold tracking-tight mt-1
            ${color}
          `}
        >
          {value}
        </p>
      </div>

 
      <div className="w-full h-[5px] rounded-full mt-5 bg-black/5 dark:bg-white/10 overflow-hidden">
        <div className={`h-full ${barColor} rounded-full opacity-80`} />
      </div>
    </motion.div>
  );
}
