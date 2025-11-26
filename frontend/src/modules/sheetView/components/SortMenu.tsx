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
        absolute right-0 mt-2 z-40 w-56 p-2 rounded-2xl
        bg-[#1A1824]
        border border-[#2C2838]
        shadow-xl backdrop-blur-xl
        animate-fadeIn
      "
    >
      {options.map((opt) => {
        const active = sortField === opt.key;

        return (
          <button
            key={opt.key}
            onClick={() => applySort(opt.key as SortField)}
            className={`
              w-full flex items-center justify-between px-3 py-2
              rounded-xl text-sm transition-all select-none

              ${
                active
                  ? "bg-[#241F33] text-[#B7A4FF] font-semibold"
                  : "text-[#C8C5D6]"
              }

              hover:bg-[#241F33]
            `}
          >
            {opt.label}

            {active &&
              (direction === "asc" ? (
                <SortAsc size={18} className="text-[#B7A4FF]" />
              ) : (
                <SortDesc size={18} className="text-[#B7A4FF]" />
              ))}
          </button>
        );
      })}
    </div>
  );
}
