import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  SortAsc,
  SortDesc,
  Pencil,
  Trash2,
  Plus,
  ChevronDown,
} from "lucide-react";

import { SortMenu } from "./SortMenu";
import type { Sheet, SortField } from "../types/sheet";

interface Props {
  sheet: Sheet;

  search: string;
  setSearch: (v: string) => void;

  sortMenuOpen: boolean;
  setSortMenuOpen: (v: boolean) => void;

  direction: "asc" | "desc";
  sortField: SortField;
  setSortField: (v: SortField) => void;
  setDirection: (v: "asc" | "desc") => void;

  deletingSheet: boolean;
  deleteSheet: () => void;

  openEditSheetModal: () => void;
  openCreateItemModal: () => void;
}

export function Header({
  sheet,
  search,
  setSearch,
  sortMenuOpen,
  setSortMenuOpen,
  direction,
  sortField,
  setSortField,
  setDirection,
  deletingSheet,
  deleteSheet,
  openEditSheetModal,
  openCreateItemModal,
}: Props) {
  return (
    <div
      className="
        rounded-3xl px-8 py-7 shadow-sm border transition-all

        bg-white border-[#E6E1F7]
        dark:bg-[#13111B] dark:border-[#1F1C2A] dark:shadow-xl
      "
    >

      <div className="flex items-start gap-4">

  
        <Link
          to="/sheets"
          className="
            flex items-center gap-2 text-[#7B61FF] text-sm font-medium
            hover:underline hover:text-[#6A54E6]
            dark:text-[#B7A4FF] dark:hover:text-[#D0C7FF]
            transition-all
          "
        >
          <ArrowLeft size={18} /> Voltar
        </Link>

        <div>
          <h1
            className="
              text-2xl font-bold tracking-tight leading-tight
              text-[#2F2F36]
              dark:text-[#ECEAF6]
            "
          >
            {sheet?.name}
          </h1>

          {sheet?.description && (
            <p
              className="
                text-sm mt-1 leading-snug
                text-gray-500
                dark:text-gray-400
              "
            >
              {sheet.description}
            </p>
          )}
        </div>
      </div>

      <div
        className="
          mt-8
          flex flex-col md:flex-row items-stretch md:items-center 
          gap-4 relative
        "
      >
 
        <div className="relative group">
          <Search
            className="
              absolute left-3 top-1/2 -translate-y-1/2
              text-gray-400 group-focus-within:text-[#7B61FF]
              dark:text-gray-500 dark:group-focus-within:text-[#B7A4FF]
              transition-colors
            "
            size={18}
          />

          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              border rounded-xl pl-10 pr-3 py-2 w-full md:w-64 text-sm
              bg-white shadow-sm border-[#E6E1F7]
              placeholder:text-gray-400
              focus:ring-2 focus:ring-[#7B61FF]/50 focus:border-[#7B61FF]
              outline-none transition-all

              dark:bg-[#1A1824] dark:border-[#2C2838] dark:text-gray-200
              dark:placeholder:text-gray-500
              dark:focus:ring-[#B7A4FF]/40 dark:focus:border-[#B7A4FF]
            "
          />
        </div>

        <div className="relative">
          <button
            className="
              rounded-xl px-4 py-2 flex items-center gap-2 text-sm transition-all
              bg-white border border-[#E6E1F7] text-gray-700 shadow-sm

              hover:bg-[#F5F2FF] hover:border-[#D7D0FF]

              dark:bg-[#1A1824] dark:border-[#2C2838] dark:text-gray-200
              dark:hover:bg-[#241F33] dark:hover:border-[#3A334B]
              active:scale-[0.98]
            "
            onClick={() => setSortMenuOpen(!sortMenuOpen)}
          >
            {direction === "asc" ? (
              <SortAsc size={18} className="text-[#7B61FF] dark:text-[#B7A4FF]" />
            ) : (
              <SortDesc size={18} className="text-[#7B61FF] dark:text-[#B7A4FF]" />
            )}

            Ordenar

            <ChevronDown
              size={14}
              className={`
                text-gray-500 dark:text-gray-400 transition-transform
                ${sortMenuOpen ? "rotate-180" : ""}
              `}
            />
          </button>

          <SortMenu
            open={sortMenuOpen}
            toggle={() => setSortMenuOpen(!sortMenuOpen)}
            sortField={sortField}
            direction={direction}
            applySort={(field) => {
              if (field === sortField) {
                setDirection(direction === "asc" ? "desc" : "asc");
              } else {
                setSortField(field);
                setDirection("asc");
              }
              setSortMenuOpen(false);
            }}
          />
        </div>

        <button
          onClick={openEditSheetModal}
          className="
            px-4 py-2 rounded-xl border text-sm flex items-center gap-2
            bg-[#E6F0FF] text-[#2F4A8A] border-[#C3D7FF]
            hover:bg-[#dce9ff] shadow-sm transition-all active:scale-[0.98]

            dark:bg-[#1A1824] dark:border-[#2C2838] dark:text-[#C9D8FF]
            dark:hover:bg-[#2A2638]
          "
        >
          <Pencil size={16} />
          Editar
        </button>

        <button
          onClick={deleteSheet}
          disabled={deletingSheet}
          className="
            px-4 py-2 rounded-xl border text-sm flex items-center gap-2
            bg-red-50 text-red-600 border-red-200
            hover:bg-red-100 shadow-sm active:scale-[0.98]
            disabled:opacity-60 disabled:cursor-not-allowed

            dark:bg-[#2A1A1F] dark:text-red-300 dark:border-[#3A222A]
            dark:hover:bg-[#3A222A]
          "
        >
          {deletingSheet ? "Excluindo..." : <><Trash2 size={16}/> Excluir</>}
        </button>

        <button
          onClick={openCreateItemModal}
          className="
            px-6 py-2 rounded-xl text-sm flex items-center gap-2 font-medium
            bg-[#7B61FF] text-white shadow-sm
            hover:bg-[#6A54E6] transition-all active:scale-[0.98]

            dark:bg-[#7B61FF] dark:hover:bg-[#9D8AFF]
          "
        >
          <Plus size={18} />
          Novo item
        </button>
      </div>
    </div>
  );
}
