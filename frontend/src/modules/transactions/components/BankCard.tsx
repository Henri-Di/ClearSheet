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
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        style={{ background: bgFinal }}
        className="
          rounded-3xl p-7 relative cursor-default select-none
          border border-black/5 dark:border-white/10
          shadow-lg shadow-black/5 dark:shadow-black/40
          backdrop-blur-xl transition-all w-full max-w-md
          hover:shadow-2xl hover:shadow-black/20
          dark:hover:shadow-black/60
        "
      >

        {/* Tooltip premium */}
        <div
          className="absolute top-4 right-4"
          onMouseEnter={() => setHoverTip(true)}
          onMouseLeave={() => setHoverTip(false)}
        >
          <HelpCircle
            size={20}
            className="
              text-slate-700 dark:text-white/60
              cursor-pointer hover:text-slate-900
              dark:hover:text-white transition-all
            "
          />

          {hoverTip && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="
                absolute right-0 top-8 px-4 py-2 rounded-xl text-xs z-50
                bg-black/85 dark:bg-black/90 text-white
                border border-white/10 shadow-xl backdrop-blur-md
                whitespace-nowrap origin-top-right
              "
            >
              Resumo financeiro + análises detalhadas.
            </motion.div>
          )}
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {bank.title}
          </h3>

          <motion.div whileHover={{ scale: 1.14 }}>
            <div
              className="
                w-11 h-11 rounded-xl flex items-center justify-center
                bg-white/70 dark:bg-white/10 
                shadow-md backdrop-blur-sm
              "
            >
              {bank.icon}
            </div>
          </motion.div>
        </div>

        {/* Linhas */}
        <div className="space-y-3">
          <Line label="Entradas" v={bank.income} color="green" />
          <Line label="Saídas" v={bank.expense} color="red" />

          <div className="
            flex justify-between border-t pt-3 
            border-black/10 dark:border-white/10
          ">
            <span className="font-semibold text-slate-900 dark:text-white">
              Saldo
            </span>

            <span
              className={`
                font-bold text-md
                ${
                  saldo > 0
                    ? "text-green-700 dark:text-green-400"
                    : saldo < 0
                    ? "text-red-700 dark:text-red-400"
                    : "text-slate-700 dark:text-gray-300"
                }
              `}
            >
              {formatCurrency(saldo)}
            </span>
          </div>
        </div>

        {/* Sparkline suavizado */}
        <div className="mt-6">
          <div
            className="
              p-2 rounded-xl bg-white/30 dark:bg-white/5
              backdrop-blur-xl border border-white/50
              dark:border-white/10 shadow-inner
            "
          >
            <SparklineDual transactions={bank.transactions} />
          </div>
        </div>

        {/* Botão aprimorado */}
        <motion.button
          onClick={() => setOpenModal(true)}
          whileTap={{ scale: 0.96 }}
          className="
            mt-7 flex items-center gap-2 px-5 py-2.5 rounded-xl
            text-xs font-semibold transition-all
            bg-slate-900/5 hover:bg-slate-900/15 text-slate-900
            dark:bg-white/10 dark:hover:bg-white/20 dark:text-white
            backdrop-blur-sm shadow-md
          "
        >
          <BarChart3 size={16} /> Visão Analítica
        </motion.button>

        {/* Barra de saldo */}
        <div className="mt-7">
          <div
            className={`
              h-[12px] w-full rounded-full bg-gradient-to-r
              ${
                saldo > 0
                  ? "from-green-300 to-green-500 dark:from-green-400 dark:to-green-600"
                  : saldo < 0
                  ? "from-red-300 to-red-500 dark:from-red-400 dark:to-red-600"
                  : "from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-500"
              }
            `}
            style={{
              boxShadow:
                saldo > 0
                  ? "0 0 14px rgba(16,185,129,0.35)"
                  : saldo < 0
                  ? "0 0 14px rgba(239,68,68,0.35)"
                  : "0 0 10px rgba(120,120,120,0.25)",
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

/* Linha aprimorada */
function Line({ label, v, color }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-slate-600 dark:text-gray-300">{label}</span>

      <span
        className={`
          text-sm font-semibold
          ${
            color === "green"
              ? "text-green-700 dark:text-green-400"
              : "text-red-700 dark:text-red-400"
          }
        `}
      >
        {formatCurrency(v)}
      </span>
    </div>
  );
}
