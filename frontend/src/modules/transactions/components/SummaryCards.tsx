import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet2, TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react";
import { formatCurrency } from "../utils/currency";
import type { JSX } from "react/jsx-dev-runtime";

interface Props {
  entradas: number;
  saidas: number;
  saldo: number;
}

interface SummaryCardItem {
  title: string;
  value: number;
  icon: JSX.Element;
  color: string;
  bar: string;
}

export function SummaryCards({ entradas, saidas, saldo }: Props) {
  const cards: SummaryCardItem[] = [
    {
      title: "Entradas",
      value: entradas,
      icon: <TrendingUp size={26} className="text-green-600 dark:text-green-300" />,
      color: `
        bg-[#E8FFF3] border-[#C8F7DF] 
        dark:bg-[#0F1E17]/80 dark:border-[#1F3A2C]
      `,
      bar: "bg-green-500 dark:bg-green-400",
    },
    {
      title: "Saídas",
      value: saidas,
      icon: <TrendingDown size={26} className="text-red-600 dark:text-red-300" />,
      color: `
        bg-[#FFECEC] border-[#FFC8C8] 
        dark:bg-[#2C1A1A]/80 dark:border-[#462626]
      `,
      bar: "bg-red-500 dark:bg-red-400",
    },
    {
      title: "Saldo Global",
      value: saldo,
      icon: <Wallet2 size={26} className="text-indigo-600 dark:text-indigo-300" />,
      color: `
        bg-[#F0EDFF] border-[#D9D3FF] 
        dark:bg-[#1D1A30]/80 dark:border-[#2F2A4A]
      `,
      bar: saldo >= 0
        ? "bg-indigo-500 dark:bg-indigo-400"
        : "bg-red-500 dark:bg-red-400",
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.08, ease: "easeOut" },
        },
      }}
      className="
        grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 
        gap-6 w-full
      "
    >
      {cards.map((c, i) => (
        <SummaryItem key={i} {...c} />
      ))}
    </motion.div>
  );
}

function SummaryItem({ title, value, icon, color, bar }: SummaryCardItem) {
  const [hidden, setHidden] = useState(false);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className={`
        relative
        rounded-3xl p-6 border shadow-sm
        transition-all duration-300
        hover:shadow-lg hover:-translate-y-1
        overflow-hidden
        ${color}
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#2B2B2B] dark:text-gray-200">
          {title}
        </h3>

        <div
          className="
            p-2 rounded-xl bg-white/70 dark:bg-white/5
            shadow-sm border border-white/40 dark:border-white/10
            backdrop-blur-sm
          "
        >
          {icon}
        </div>
      </div>

      {/* Botão de ocultar — posicionado sem colidir com nada */}
      <button
        onClick={() => setHidden(!hidden)}
        className="
          absolute bottom-4 right-4 p-2 rounded-xl
          bg-white/80 dark:bg-white/10 
          border border-black/5 dark:border-white/10
          backdrop-blur-md shadow-sm
          hover:bg-white/90 dark:hover:bg-white/20
          transition-all
          z-20
        "
      >
        {hidden ? (
          <EyeOff size={18} className="text-gray-700 dark:text-gray-300" />
        ) : (
          <Eye size={18} className="text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Valor */}
      <p
        className="
          text-4xl font-extrabold mt-5 mb-4
          text-[#1A1A1A] dark:text-gray-100 tracking-tight
          transition-all
        "
        style={{
          filter: hidden ? "blur(8px)" : "none",
          opacity: hidden ? 0.55 : 1,
        }}
      >
        {formatCurrency(value)}
      </p>

      {/* Barra inferior */}
      <div
        className={`
          h-[6px] rounded-full relative overflow-hidden 
          ${bar}
        `}
        style={{
          boxShadow:
            value > 0
              ? "0 0 8px rgba(16,185,129,0.45)"
              : "0 0 8px rgba(239,68,68,0.45)",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="absolute inset-0 opacity-30 
                     bg-gradient-to-r from-white/20 to-transparent"
        />
      </div>
    </motion.div>
  );
}
