import { motion } from "framer-motion";
import { Wallet2, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "../utils/currency";

interface Props {
  entradas: number;
  saidas: number;
  saldo: number;
}

export function SummaryCards({ entradas, saidas, saldo }: Props) {
  const cards = [
    {
      title: "Entradas",
      value: entradas,
      icon: (
        <TrendingUp
          size={26}
          className="text-green-600 dark:text-green-400"
        />
      ),
      color:
        "bg-[#E8FFF3] border-[#C8F7DF] dark:bg-[#13251c] dark:border-[#1f3a2c]",
      bar: "bg-green-500 dark:bg-green-400",
    },
    {
      title: "Saídas",
      value: saidas,
      icon: (
        <TrendingDown
          size={26}
          className="text-red-600 dark:text-red-400"
        />
      ),
      color:
        "bg-[#FFECEC] border-[#FFC8C8] dark:bg-[#2b1717] dark:border-[#412222]",
      bar: "bg-red-500 dark:bg-red-400",
    },
    {
      title: "Saldo Global",
      value: saldo,
      icon: (
        <Wallet2 size={26} className="text-indigo-600 dark:text-indigo-400" />
      ),
      color:
        "bg-[#F0EDFF] border-[#D9D3FF] dark:bg-[#1e1a33] dark:border-[#322c55]",
      bar:
        saldo >= 0
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
          transition: { staggerChildren: 0.08 },
        },
      }}
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {cards.map((c, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0 },
          }}
          className={`
            rounded-3xl p-6 border shadow-sm transition-all
            ${c.color}
          `}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-[#2D2D2D] dark:text-gray-200">
              {c.title}
            </h3>
            <div
              className="
                p-2 bg-white/60 dark:bg-white/10 
                rounded-xl shadow-sm
              "
            >
              {c.icon}
            </div>
          </div>

          <p className="text-4xl font-extrabold mt-4 text-[#111] dark:text-gray-100">
            {formatCurrency(c.value)}
          </p>

          <div className={`h-[5px] rounded-full mt-5 opacity-80 ${c.bar}`} />
        </motion.div>
      ))}
    </motion.div>
  );
}
