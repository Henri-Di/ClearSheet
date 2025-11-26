import { motion } from "framer-motion";
import { useState } from "react";
import { HelpCircle, BarChart3 } from "lucide-react";
import { formatCurrency } from "../utils/currency";

import { SparklineDual } from "./SparklineDual";
import type { Bank } from "../types/Bank";
import { BankAnalyticsModal } from "./BankAnalyticsModal";

export function BankCard({ bank }: { bank: Bank }) {
  const saldo = (bank.income ?? 0) - (bank.expense ?? 0);

  const [hoverTip, setHoverTip] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25 }}
        style={{ background: bank.bg }}
        className="
          rounded-3xl p-6 relative cursor-default
          border border-white/40 bg-white/30 backdrop-blur-md
          shadow-md transition-all
        "
      >
    
        <div
          className="absolute top-3 right-3"
          onPointerEnter={() => setHoverTip(true)}
          onPointerLeave={() => setHoverTip(false)}
        >
          <HelpCircle size={18} className="text-black/60 cursor-pointer" />

          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={hoverTip ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
            className="
              absolute right-0 top-7 z-50 px-3 py-2
              rounded-lg text-xs bg-black text-white shadow-lg
              whitespace-nowrap pointer-events-auto
            "
          >
            Resumo do banco + análises avançadas.
          </motion.div>
        </div>

        <div className="flex justify-between items-center select-none">
          <h3 className="text-md font-semibold text-[#222]">
            {bank.title}
          </h3>

          <motion.div whileHover={{ scale: 1.12 }}>
            {bank.icon}
          </motion.div>
        </div>

        <div className="mt-4 space-y-2">
          <Line label="Entradas" v={bank.income} color="green" />
          <Line label="Saídas" v={bank.expense} color="red" />

          <div className="flex justify-between border-t pt-2 border-black/10">
            <span className="font-semibold text-[#222]">Saldo</span>
            <span
              className={`
                font-bold 
                ${saldo > 0 ? "text-green-700" :
                  saldo < 0 ? "text-red-600" :
                  "text-gray-700"}
              `}
            >
              {formatCurrency(saldo)}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <SparklineDual transactions={(bank.transactions ?? []).map(t => ({
            ...t,
            date: t.date ?? undefined, 
          }))} />
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="
            mt-6 flex items-center gap-2 px-4 py-2 rounded-xl
            bg-black/10 backdrop-blur text-xs font-semibold
            hover:bg-black/20 transition-all
          "
        >
          <BarChart3 size={15} /> Visão Analítica
        </button>

        <div className="mt-6">
          <div
            className={`
              h-[10px] w-full rounded-full
              bg-gradient-to-r 
              ${
                saldo > 0
                  ? "from-green-400 to-green-600"
                  : saldo < 0
                  ? "from-red-400 to-red-600"
                  : "from-gray-300 to-gray-500"
              }
            `}
            style={{
              boxShadow:
                saldo > 0
                  ? "0 0 10px rgba(16,185,129,0.55)"
                  : saldo < 0
                  ? "0 0 10px rgba(239,68,68,0.55)"
                  : "0 0 6px rgba(120,120,120,0.35)",
            }}
          />
        </div>
      </motion.div>

      {/* MODAL */}
      {openModal && (
        <BankAnalyticsModal bank={bank} onClose={() => setOpenModal(false)} />
      )}
    </>
  );
}

function Line({ label, v, color }: any) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <span
        className={`
          text-sm font-semibold
          ${color === "green" ? "text-green-600" : ""}
          ${color === "red" ? "text-red-600" : ""}
        `}
      >
        {formatCurrency(v)}
      </span>
    </div>
  );
}
