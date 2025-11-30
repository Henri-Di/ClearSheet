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
        rounded-[28px] md:rounded-[32px]
        border border-[#E6E1F7]
        dark:border-[#2d2641]

        bg-white dark:bg-[#181422]
        shadow-md md:shadow-xl shadow-black/5

        w-full
        mb-8

        p-5 sm:p-6 md:p-8
        transition-all duration-200

        /* MOBILE: sem limite de altura */
        max-h-none
        /* DESKTOP: limite elegante */
        md:max-h-[78vh]

        overflow-y-auto custom-scroll
      "
    >

      <div
        className="
          flex flex-col md:flex-row
          md:items-center md:justify-between
          gap-4 sm:gap-5 md:gap-6
          mb-6 md:mb-8
        "
      >
        <div className="flex flex-col gap-1">
          <h1
            className="
              text-2xl sm:text-3xl md:text-4xl 
              font-extrabold leading-tight
              text-gray-900 dark:text-gray-100
              tracking-tight
            "
          >
            {sheet.name}
          </h1>

          <span
            className="
              text-sm sm:text-base 
              font-medium
              text-gray-600 dark:text-gray-400
              mt-[2px]
            "
          >
            {String(sheet.month).padStart(2, "0")}/{sheet.year}
          </span>
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
