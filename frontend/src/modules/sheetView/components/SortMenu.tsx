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
        absolute
        top-[calc(100%+8px)]
        right-0
        z-[9999]

        w-60
        rounded-2xl
        p-2
        shadow-xl
        backdrop-blur-xl

        bg-white/90
        border border-[#E6E1F7]

        dark:bg-[#1A1824]/95
        dark:border-[#2C2838]

        animate-fadeIn
      "
    >
      <div
        className="
          max-h-[200px]
          overflow-y-auto

          /* ALINHAMENTO DO SCROLL — FIX */
          pr-2
          mr-[-4px]

          scrollbar-thin
          scrollbar-thumb-[#D0C7FF]
          dark:scrollbar-thumb-[#3A334B]
        "
      >
        {options.map((opt) => {
          const active = sortField === opt.key;

          return (
            <button
              key={opt.key}
              onClick={() => applySort(opt.key as SortField)}
              className={`
                w-full
                px-3 py-3
                rounded-xl
                text-sm
                flex items-center justify-between
                transition-all
                select-none

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
