import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HelpCircle, BarChart3, Eye, EyeOff } from "lucide-react";
import { formatCurrency } from "../utils/currency";
import { SparklineDual } from "./SparklineDual";
import { BankAnalyticsModal } from "./BankAnalyticsModal";
import { resolveBankIcon } from "./bankIcons";

export function BankCard({ bank }: any) {
  const saldo = (bank.income ?? 0) - (bank.expense ?? 0);

  const [hoverTip, setHoverTip] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);

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

  const visual = resolveBankIcon(bank.key);
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
          border border-black/10 dark:border-white/10
          shadow-lg shadow-black/10 dark:shadow-black/30
          backdrop-blur-xl transition-all w-full max-w-md
        "
      >
        {/* Tooltip */}
        <div
          className="absolute top-4 right-4"
          onMouseEnter={() => setHoverTip(true)}
          onMouseLeave={() => setHoverTip(false)}
        >
          <HelpCircle
            size={18}
            className="text-black/50 dark:text-white/60 cursor-pointer hover:text-black dark:hover:text-white transition"
          />

          {hoverTip && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="
                absolute right-0 top-8 px-4 py-2 rounded-xl text-xs z-50
                bg-black/80 text-white border border-white/10
                shadow-xl backdrop-blur-md whitespace-nowrap
              "
            >
              Resumo financeiro + análises detalhadas.
            </motion.div>
          )}
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <h3
            className="
              text-lg font-semibold 
              text-black dark:text-white
            "
          >
            {bank.title}
          </h3>

          {/* Ícone Premium com letra corrigida */}
          <motion.div whileHover={{ scale: 1.08 }}>
            <div
              className="
                w-16 h-16 rounded-full relative overflow-hidden
                flex items-center justify-center
                shadow-[0_8px_22px_rgba(0,0,0,0.22)]
                ring-1 ring-black/10 backdrop-blur-xl
              "
            >
              {/* Glow colorido */}
              <div
                className="absolute inset-0 rounded-full blur-xl opacity-60"
                style={{ background: visual.color }}
              />

              {/* SVG atrás */}
              <div className="absolute inset-0 flex items-center justify-center opacity-90">
                {visual.icon}
              </div>

              {/* Letra na frente (CORRIGIDO) */}
              <span
                className="
                  relative z-20 text-white font-bold text-xl 
                  drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]
                "
              >
                {visual.letter}
              </span>
            </div>
          </motion.div>
        </div>

        {/* LINHAS */}
        <div className="space-y-3">
          <Line label="Entradas" v={bank.income} color="green" />
          <Line label="Saídas" v={bank.expense} color="red" />

          <div className="flex justify-between border-t pt-3 border-black/10 dark:border-white/20">
            <span className="font-semibold text-black/80 dark:text-white/90">
              Saldo
            </span>

            <span
              className={`
                font-bold text-md transition-all
                ${
                  saldo > 0
                    ? "text-green-600 dark:text-green-300"
                    : saldo < 0
                    ? "text-red-600 dark:text-red-300"
                    : "text-black/60 dark:text-white/70"
                }
              `}
              style={{
                filter: hideBalance ? "blur(7px)" : "none",
                opacity: hideBalance ? 0.55 : 1,
              }}
            >
              {formatCurrency(saldo)}
            </span>
          </div>
        </div>

        {/* MINI GRÁFICO */}
        <div className="mt-6">
          <div
            className="
              p-2 rounded-xl bg-white/40 dark:bg-white/5
              backdrop-blur-xl border border-white/30 dark:border-white/10
              shadow-inner
            "
          >
            <SparklineDual transactions={bank.transactions} />
          </div>
        </div>

        {/* BOTÃO ANALÍTICO */}
        <motion.button
          onClick={() => setOpenModal(true)}
          whileTap={{ scale: 0.96 }}
          className="
            mt-7 flex items-center gap-2 px-5 py-2.5 rounded-xl
            text-xs font-semibold transition-all
            bg-white/60 hover:bg-white/80 text-black
            dark:bg-white/10 dark:hover:bg-white/20 dark:text-white
            backdrop-blur-sm shadow-md
          "
        >
          <BarChart3 size={16} /> Visão Analítica
        </motion.button>

        {/* BOTÃO OCULTAR SALDO */}
        <button
          onClick={() => setHideBalance(!hideBalance)}
          className="
            absolute bottom-4 right-4 p-2 rounded-xl
            bg-white/70 dark:bg-white/10
            border border-black/10 dark:border-white/20
            backdrop-blur-md shadow-sm
            hover:bg-white/90 dark:hover:bg-white/20
            transition-all
          "
        >
          {hideBalance ? (
            <EyeOff size={18} className="text-black dark:text-white/90" />
          ) : (
            <Eye size={18} className="text-black dark:text-white/90" />
          )}
        </button>

        {/* BARRA */}
        <div className="mt-7">
          <div
            className={`
              h-[12px] w-full rounded-full bg-gradient-to-r
              ${
                saldo > 0
                  ? "from-green-500 to-green-600"
                  : saldo < 0
                  ? "from-red-500 to-red-600"
                  : "from-black/20 to-black/10 dark:from-white/40 dark:to-white/20"
              }
            `}
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
    <div className="flex justify-between items-center">
      <span className="text-sm text-black/60 dark:text-white/80">
        {label}
      </span>

      <span
        className={`
          text-sm font-semibold
          ${
            color === "green"
              ? "text-green-600 dark:text-green-300"
              : "text-red-600 dark:text-red-300"
          }
        `}
      >
        {formatCurrency(v)}
      </span>
    </div>
  );
}
