import { SummaryCards } from "./SummaryCards";
import type { UnifiedItem } from "../types/sheet";

interface Props {
  sheet: {
    id: number;
    name: string;
    month: number;
    year: number;
    initial_balance: number;
  };

  entradas: number;
  saidas: number;
  items: UnifiedItem[];
}

/* -----------------------------------------------------------
    SheetCard — versão pastel 2026 completa + responsiva
----------------------------------------------------------- */
export function SheetCard({ sheet, entradas, saidas, items }: Props) {
  return (
    <div
      className="
        rounded-[32px]
        shadow-xl shadow-black/5 
        border border-[#E6E1F7] 
        bg-white 
        dark:bg-[#181422] 
        dark:border-[#2d2641]

        p-8 
        w-full 
        mb-10 
        transition-all

        max-h-[78vh] 
        overflow-y-auto 
        custom-scroll
      "
    >

      {/* HEADER — nome + mês/ano */}
      <div
        className="
          flex flex-col md:flex-row 
          md:items-center md:justify-between 
          gap-6 mb-6
        "
      >
        <div className="flex flex-col gap-1">

          <h1
            className="
              text-3xl font-extrabold 
              text-gray-900 dark:text-gray-100 
              tracking-tight 
              leading-tight
            "
          >
            {sheet.name}
          </h1>

          <div
            className="
              text-sm font-medium 
              text-gray-600 dark:text-gray-400 
              mt-[2px]
            "
          >
            {String(sheet.month).padStart(2, "0")}/{sheet.year}
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <SummaryCards
        sheet={sheet}
        entradas={entradas}
        saidas={saidas}
        items={items}
      />
    </div>
  );
}
