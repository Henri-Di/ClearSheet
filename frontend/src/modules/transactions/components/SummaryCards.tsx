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
          className="text-green-600 dark:text-green-300"
        />
      ),
      color: `
        bg-[#E8FFF3] border-[#C8F7DF] 
        dark:bg-[#0F1E17]/80 dark:border-[#1F3A2C]
      `,
      bar: `
        bg-green-500 dark:bg-green-400
      `,
    },
    {
      title: "Saídas",
      value: saidas,
      icon: (
        <TrendingDown
          size={26}
          className="text-red-600 dark:text-red-300"
        />
      ),
      color: `
        bg-[#FFECEC] border-[#FFC8C8] 
        dark:bg-[#2C1A1A]/80 dark:border-[#462626]
      `,
      bar: `
        bg-red-500 dark:bg-red-400
      `,
    },
    {
      title: "Saldo Global",
      value: saldo,
      icon: (
        <Wallet2 size={26} className="text-indigo-600 dark:text-indigo-300" />
      ),
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
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className={`
            rounded-3xl p-6 border shadow-sm
            transition-all duration-300
            hover:shadow-lg hover:-translate-y-1
            ${c.color}
          `}
        >
 
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-[#2B2B2B] dark:text-gray-200">
              {c.title}
            </h3>

            <div
              className="
                p-2 rounded-xl 
                bg-white/70 dark:bg-white/5
                shadow-sm border border-white/40 dark:border-white/10
                backdrop-blur-sm
              "
            >
              {c.icon}
            </div>
          </div>

    
          <p
            className="
              text-4xl font-extrabold mt-5 
              text-[#1A1A1A] dark:text-gray-100 tracking-tight
            "
          >
            {formatCurrency(c.value)}
          </p>

    
          <div
            className={`
              h-[6px] rounded-full mt-6 relative overflow-hidden 
              ${c.bar}
            `}
            style={{
              boxShadow:
                c.value > 0
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
      ))}
    </motion.div>
  );
}
