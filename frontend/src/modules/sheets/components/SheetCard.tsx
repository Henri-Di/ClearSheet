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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.22 }}
      className="
        relative
        bg-white dark:bg-[#14131A]
        border border-[#E6E1F7] dark:border-[#2C2B33]
        rounded-3xl
        p-4 sm:p-5 md:p-6
        shadow-sm
        overflow-visible
        group
        transition-all duration-200
      "
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        if (window.innerWidth < 768) return; 
        const isDark = document.documentElement.classList.contains("dark");

        el.style.borderColor = isDark ? "#4B4A56" : "#C9B8FF";
        el.style.backgroundColor = isDark
          ? "rgba(255,255,255,0.05)"
          : "rgba(247,243,255,0.75)";
        el.style.boxShadow = isDark
          ? "0 16px 32px rgba(0,0,0,0.45)"
          : "0 16px 38px rgba(123, 97, 255, 0.22)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "";
        el.style.backgroundColor = "";
        el.style.boxShadow = "";
      }}
    >

   
      <div
        className="
          absolute -top-6 left-1/2 -translate-x-1/2
          hidden md:block
          opacity-0 group-hover:opacity-100
          transition
          z-20 pointer-events-none
        "
      >
        <div
          className="
            flex items-center gap-1 text-xs px-3 py-1
            bg-[#F4F1FF] dark:bg-[#1A1923]
            border border-[#E6E1F7] dark:border-[#34333D]
            rounded-xl text-[#6C63FF] dark:text-gray-200
            shadow-md
          "
        >
          <HelpCircle size={12} /> Clique para abrir
        </div>
      </div>


      <Link to={`/app/sheets/${sheet.id}`} className="block w-full">

 
        <div className="flex items-start justify-between">

          <div className="flex items-start gap-4">

            <motion.div
              whileHover={{ rotate: -4, scale: 1.06 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="
                p-3 sm:p-3.5 md:p-4
                rounded-2xl border
                border-[#E6E1F7] dark:border-[#34333D]
                shadow-sm
                bg-[#F8F7FF] dark:bg-[#1E1D25]
              "
            >
              <FileSpreadsheet
                size={26}
                className="text-[#7B61FF] dark:text-[#A99BFF]"
              />
            </motion.div>

     
            <div>
              <h3
                className="
                  text-lg sm:text-xl md:text-2xl
                  font-semibold
                  text-[#2F2F36] dark:text-white/90
                  group-hover:text-[#7B61FF] dark:group-hover:text-[#A99BFF]
                  transition
                "
              >
                {sheet.name}
              </h3>

              <div className="
                flex flex-wrap items-center gap-3
                text-xs sm:text-sm 
                text-gray-600 dark:text-gray-300
                mt-1
              ">
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="opacity-70" />
                  {sheet.month}/{sheet.year}
                </span>

                {sheet.description && (
                  <span
                    className="
                      flex items-center gap-1
                      text-gray-500 dark:text-gray-300
                    "
                    title={sheet.description}
                  >
                    <Info size={14} />
                    <span className="text-xs opacity-70 max-w-[120px] sm:max-w-[220px] truncate">
                      {sheet.description}
                    </span>
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>
      </Link>


      <div
        className="
          grid grid-cols-2 sm:grid-cols-4
          gap-3 sm:gap-4 md:gap-5
          mt-5 sm:mt-6
        "
        onClick={(e) => e.stopPropagation()}
      >
        <InfoBox title="Saldo Inicial" value={initial} color="#9A84FF" animated />
        <InfoBox title="Entradas"       value={entradas} color="#28A745" animated />
        <InfoBox title="Saídas"         value={saidas} color="#E63946" animated />
        <InfoBox title="Saldo Final"    value={final} color="#9A84FF" animated />
      </div>


      <div
        className="
          absolute top-4 right-4 
          flex items-center gap-2 sm:gap-3
          z-20
        "
      >
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onEdit();
          }}
          className="
            px-2.5 sm:px-3 py-1.5 rounded-2xl text-xs sm:text-sm
            text-[#7B61FF] dark:text-[#A99BFF]
            border border-[#E6E1F7] dark:border-[#34333D]
            hover:bg-[#EFEAFF] dark:hover:bg-white/10
            transition
            flex items-center gap-1.5
            shadow-sm
            bg-white dark:bg-[#1D1C22]
          "
        >
          <Pencil size={14} /> Editar
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
            px-2.5 sm:px-3 py-1.5 rounded-2xl text-xs sm:text-sm
            text-red-600 dark:text-red-400
            border border-red-200 dark:border-red-900
            hover:bg-red-50 dark:hover:bg-red-900/30
            transition
            flex items-center gap-1.5
            shadow-sm
            bg-white dark:bg-[#1D1C22]
          "
        >
          <Trash2 size={14} /> Excluir
        </motion.button>
      </div>

    </motion.div>
  );
}
