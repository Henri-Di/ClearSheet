import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HelpCircle, BarChart3 } from "lucide-react";
import { formatCurrency } from "../utils/currency";
import { SparklineDual } from "./SparklineDual";
import { BankAnalyticsModal } from "./BankAnalyticsModal";

export function BankCard({ bank }: any) {
  const saldo = (bank.income ?? 0) - (bank.expense ?? 0);

  const [hoverTip, setHoverTip] = useState(false);
  const [openModal, setOpenModal] = useState(false);


  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    obs.observe(document.documentElement, { attributes: true });
    return () => obs.disconnect();
  }, []);

  const bgFinal = isDark ? bank.bgDark : bank.bg;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25 }}
        style={{ background: bgFinal }}
        className="
          rounded-3xl p-6 relative cursor-default select-none
          border border-white/40
          shadow-xl backdrop-blur-xl 
          transition-all w-full max-w-md
        "
      >

        <div
          className="absolute top-3 right-3"
          onMouseEnter={() => setHoverTip(true)}
          onMouseLeave={() => setHoverTip(false)}
        >
          <HelpCircle
            size={18}
            className="text-black/60 dark:text-white/60 cursor-pointer"
          />

          {hoverTip && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="
                absolute right-0 top-7 z-50 px-3 py-2 rounded-lg text-xs 
                bg-black/80 dark:bg-black/90 
                text-white border border-white/10
                shadow-xl backdrop-blur-md 
                whitespace-nowrap 
              "
            >
              Resumo do banco + análises avançadas.
            </motion.div>
          )}
        </div>

  
        <div className="flex justify-between items-center">
          <h3 className="text-md font-semibold text-white">
            {bank.title}
          </h3>

          <motion.div whileHover={{ scale: 1.12 }}>
            {bank.icon}
          </motion.div>
        </div>

    
        <div className="mt-4 space-y-2">
          <Line label="Entradas" v={bank.income} color="green" />
          <Line label="Saídas" v={bank.expense} color="red" />

          <div className="flex justify-between border-t pt-2 border-white/20">
            <span className="font-semibold text-white">
              Saldo
            </span>
            <span
              className={`
                font-bold
                ${
                  saldo > 0
                    ? "text-green-400"
                    : saldo < 0
                    ? "text-red-400"
                    : "text-gray-300"
                }
              `}
            >
              {formatCurrency(saldo)}
            </span>
          </div>
        </div>

  
        <div className="mt-5">
          <SparklineDual transactions={bank.transactions} />
        </div>


        <button
          onClick={() => setOpenModal(true)}
          className="
            mt-6 flex items-center gap-2 px-4 py-2 rounded-xl
            bg-white/10
            text-xs font-semibold 
            hover:bg-white/20
            text-white
            backdrop-blur-sm 
            shadow-md
            transition-all
          "
        >
          <BarChart3 size={15} /> Visão Analítica
        </button>

      
        <div className="mt-6">
          <div
            className={`
              h-[10px] w-full rounded-full bg-gradient-to-r
              ${
                saldo > 0
                  ? "from-green-400 to-green-600"
                  : saldo < 0
                  ? "from-red-400 to-red-600"
                  : "from-gray-300 to-gray-400"
              }
            `}
            style={{
              boxShadow:
                saldo > 0
                  ? "0 0 12px rgba(16,185,129,0.65)"
                  : saldo < 0
                  ? "0 0 12px rgba(239,68,68,0.65)"
                  : "0 0 8px rgba(120,120,120,0.45)",
            }}
          />
        </div>
      </motion.div>

      {openModal && (
        <BankAnalyticsModal bank={bank} onClose={() => setOpenModal(false)} />
      )}
    </>
  );
}



function Line({ label, v, color }: any) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-gray-200">{label}</span>
      <span
        className={`
          text-sm font-semibold
          ${color === "green" ? "text-green-400" : "text-red-400"}
        `}
      >
        {formatCurrency(v)}
      </span>
    </div>
  );
}
