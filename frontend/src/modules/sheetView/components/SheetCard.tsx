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

export function SheetCard({ sheet, entradas, saidas, items }: Props) {
  return (
    <div
      className="
        rounded-3xl 
        shadow-xl 
        border border-[#E6E1F7] 
        bg-white 
        dark:bg-[#181422] 
        dark:border-[#2d2641]
        p-8 
        w-full 
        mb-10 
        transition-all
      "
    >

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
            "
          >
            {sheet.name}
          </h1>

          <div
            className="
              text-sm font-medium 
              text-gray-600 dark:text-gray-400
            "
          >
            {String(sheet.month).padStart(2, "0")}/{sheet.year}
          </div>
        </div>
      </div>

      <SummaryCards
        sheet={sheet}
        entradas={entradas}
        saidas={saidas}
        items={items}
      />
    </div>
  );
}
