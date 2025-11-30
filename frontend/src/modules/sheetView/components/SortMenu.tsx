import { SortAsc, SortDesc } from "lucide-react";
import type { SortField, SortDirection } from "../types/sheet";

interface Props {
  sortField: SortField;
  direction: SortDirection;
  open: boolean;
  toggle: () => void;
  applySort: (field: SortField) => void;
}

const options = [
  { key: "date", label: "Data" },
  { key: "value", label: "Valor" },
  { key: "category", label: "Categoria" },
  { key: "bank", label: "Banco" },
  { key: "type", label: "Tipo" },
  { key: "origin", label: "Origem" },
];

export function SortMenu({
  sortField,
  direction,
  open,
  applySort,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="
        absolute right-0 mt-2 z-40 w-60
        rounded-2xl p-2
        shadow-xl backdrop-blur-xl animate-fadeIn
        
        /* LIGHT */
        bg-white/90 border border-[#E6E1F7]
        
        /* DARK */
        dark:bg-[#1A1824]/95 dark:border-[#2C2838]
      "
    >
      {/* ---------------- SCROLL CONTAINER --------------- */}
      <div
        className="
          max-h-[260px] overflow-y-auto custom-scroll
          pr-1
        "
      >
        {options.map((opt) => {
          const active = sortField === opt.key;

          return (
            <button
              key={opt.key}
              onClick={() => applySort(opt.key as SortField)}
              className={`
                w-full px-3 py-3 rounded-xl text-sm 
                flex items-center justify-between 
                transition-all select-none

                ${
                  active
                    ? "text-[#7B61FF] font-semibold bg-[#F4F0FF] dark:bg-[#241F33] dark:text-[#B7A4FF]"
                    : "text-[#3A3843] dark:text-[#C8C5D6]"
                }

                hover:bg-[#EEE8FF] dark:hover:bg-[#241F33]
              `}
            >
              <span>{opt.label}</span>

              {active &&
                (direction === "asc" ? (
                  <SortAsc size={18} className="text-[#7B61FF] dark:text-[#B7A4FF]" />
                ) : (
                  <SortDesc size={18} className="text-[#7B61FF] dark:text-[#B7A4FF]" />
                ))}
            </button>
          );
        })}
      </div>
    </div>
  );
}
