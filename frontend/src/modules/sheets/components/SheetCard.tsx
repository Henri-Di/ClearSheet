import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileSpreadsheet,
  Pencil,
  Trash2,
  Calendar,
  Info,
  HelpCircle,
} from "lucide-react";

import { InfoBox } from "./InfoBox";
import type { Sheet, SheetSummary } from "../types/sheet";

export function SheetCard({
  sheet,
  summary,
  onDelete,
  onEdit,
}: {
  sheet: Sheet;
  summary?: SheetSummary;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const entradas = Number(summary?.entradas ?? 0);
  const saidas = Number(summary?.saidas ?? 0);
  const initial = Number(summary?.initial ?? sheet.initial_balance);
  const final = Number(summary?.saldo_final ?? initial + entradas - saidas);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.22 }}
      className="
        relative 
        bg-white dark:bg-[#14131A]
        border border-[#E6E1F7] dark:border-[#2C2B33]
        rounded-3xl p-6 shadow-sm
        cursor-pointer overflow-visible
        group transition-all
      "
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        const isDark = document.documentElement.classList.contains("dark");

        el.style.borderColor = isDark ? "#4B4A56" : "#C9B8FF";
        el.style.backgroundColor = isDark
          ? "rgba(255,255,255,0.04)"
          : "rgba(247,243,255,0.65)";
        el.style.boxShadow = isDark
          ? "0 12px 28px rgba(0,0,0,0.45)"
          : "0 12px 35px rgba(123, 97, 255, 0.28)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "";
        el.style.backgroundColor = "";
        el.style.boxShadow = "";
      }}
    >
      {/* TOOLTIP SUPERIOR */}
      <div
        className="
          absolute -top-5 left-1/2 -translate-x-1/2 
          opacity-0 group-hover:opacity-100 
          transition z-20
        "
      >
        <div
          className="
            flex items-center gap-1 text-xs px-3 py-1 
            bg-[#F4F1FF] dark:bg-dark-bg 
            border border-[#E6E1F7] dark:border-dark-border 
            rounded-xl text-[#6C63FF] dark:text-gray-200 
            shadow-md
          "
        >
          <HelpCircle size={12} /> Clique para abrir
        </div>
      </div>

      {/* LINK PRINCIPAL DO CARD (SEM OVERLAY) */}
      <Link
        to={`/app/sheets/${sheet.id}`}
        className="block w-full h-full relative z-10"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: -4, scale: 1.06 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="
                p-3 rounded-2xl border 
                border-[#E6E1F7] dark:border-dark-border
                shadow-sm bg-[#F8F7FF] dark:bg-white/10
              "
            >
              <FileSpreadsheet
                size={28}
                className="text-[#7B61FF] dark:text-[#9d8aff]"
              />
            </motion.div>

            <div>
              <h3
                className="
                  text-xl font-semibold 
                  text-[#2F2F36] dark:text-gray-200
                  group-hover:text-[#7B61FF] dark:group-hover:text-[#9d8aff]
                  transition
                "
              >
                {sheet.name}
              </h3>

              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="opacity-70" />
                  {sheet.month}/{sheet.year}
                </span>

                {sheet.description && (
                  <span
                    className="flex items-center gap-1 text-gray-500 dark:text-gray-300"
                    title={sheet.description}
                  >
                    <Info size={14} />
                    <span className="text-xs opacity-70 max-w-[150px] truncate">
                      {sheet.description}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BOXES */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
          <InfoBox title="Saldo Inicial" value={initial} color="#9A84FF" animated />
          <InfoBox title="Entradas" value={entradas} color="#28A745" animated />
          <InfoBox title="Saídas" value={saidas} color="#E63946" animated />
          <InfoBox title="Saldo Final" value={final} color="#9A84FF" animated />
        </div>
      </Link>

      {/* BOTÕES QUE NÃO DEVEM ACIONAR O LINK */}
      <div className="absolute right-6 top-6 flex items-center gap-3 z-20">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onEdit();
          }}
          className="
            px-3 py-1.5 rounded-2xl text-sm
            text-[#7B61FF] dark:text-[#9d8aff]
            border border-[#E6E1F7] dark:border-dark-border
            hover:bg-[#EFEAFF] dark:hover:bg-white/10
            transition flex items-center gap-1.5 
            shadow-sm bg-white dark:bg-dark-card
          "
        >
          <Pencil size={15} /> Editar
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete();
          }}
          className="
            px-3 py-1.5 rounded-2xl text-sm
            text-red-600 dark:text-red-400
            border border-red-200 dark:border-red-900
            hover:bg-red-50 dark:hover:bg-red-900/30
            transition flex items-center gap-1.5
            shadow-sm bg-white dark:bg-dark-card
          "
        >
          <Trash2 size={15} /> Excluir
        </motion.button>
      </div>
    </motion.div>
  );
}
