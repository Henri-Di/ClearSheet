import { Link } from "react-router-dom";
import {
  ArrowLeft,
  SortAsc,
  SortDesc,
  Pencil,
  Trash2,
  Plus,
  Search,
  ChevronDown,
} from "lucide-react";

import { SortMenu } from "./SortMenu";
import type { Sheet, SortField, Category, Bank } from "../types/sheet";

interface Props {
  sheet: Sheet;

  search: string;
  setSearch: (v: string) => void;

  category: string;
  setCategory: (v: string) => void;

  bank: string;
  setBank: (v: string) => void;

  categories: Category[] | null;
  banks: Bank[] | null;

  sortMenuOpen: boolean;
  setSortMenuOpen: (v: boolean) => void;

  direction: "asc" | "desc";
  sortField: SortField;
  setSortField: (v: SortField) => void;
  setDirection: (v: "asc" | "desc") => void;

  deleteSheet: () => void;
  openEditSheetModal: () => void;
  openCreateItemModal: () => void;
}

export function Header({
  sheet,

  search,
  setSearch,

  category,
  setCategory,

  bank,
  setBank,

  categories,
  banks,

  sortMenuOpen,
  setSortMenuOpen,

  direction,
  sortField,
  setSortField,
  setDirection,

  deleteSheet,
  openEditSheetModal,
  openCreateItemModal,
}: Props) {
  return (
    <div
      className="
        rounded-3xl px-8 py-7 shadow-sm border
        bg-white border-[#E6E1F7]
        dark:bg-[#13111B] dark:border-[#1F1C2A]
        space-y-6
      "
    >
      {/* TOPO */}
      <div className="flex items-start gap-4">
        <Link
          to="/sheets"
          className="
            flex items-center gap-2 text-[#7B61FF] text-sm font-medium
            hover:underline hover:text-[#6A54E6]
            dark:text-[#B7A4FF] dark:hover:text-[#D0C7FF]
          "
        >
          <ArrowLeft size={18} /> Voltar
        </Link>

        <div>
          <h1
            className="
              text-2xl font-bold tracking-tight
              text-[#2F2F36]
              dark:text-[#ECEAF6]
            "
          >
            {sheet.name}
          </h1>

          {sheet.description && (
            <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
              {sheet.description}
            </p>
          )}
        </div>
      </div>

      {/* FILTROS AVANÇADOS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400 dark:text-gray-500"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="
              w-full pl-10 pr-3 py-2 rounded-xl
              bg-[#FBFAFF] dark:bg-[#181720]
              border border-[#E0DEED] dark:border-[#262433]
              text-sm
            "
          />
        </div>

        {/* Categoria */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="
            w-full py-2 px-3 rounded-xl text-sm
            bg-[#FBFAFF] dark:bg-[#181720]
            border border-[#E0DEED] dark:border-[#262433]
          "
        >
          <option value="">Categoria</option>
          {categories?.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Banco */}
        <select
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          className="
            w-full py-2 px-3 rounded-xl text-sm
            bg-[#FBFAFF] dark:bg-[#181720]
            border border-[#E0DEED] dark:border-[#262433]
          "
        >
          <option value="">Banco</option>
          {banks?.map((b) => (
            <option key={b.id} value={String(b.id)}>
              {b.name}
            </option>
          ))}
        </select>

        {/* Sort Field + Direction */}
        <div className="flex gap-2">
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortField)}
            className="
              w-full py-2 px-3 rounded-xl text-sm
              bg-[#FBFAFF] dark:bg-[#181720]
              border border-[#E0DEED] dark:border-[#262433]
            "
          >
            <option value="date">Data</option>
            <option value="value">Valor</option>
            <option value="category">Categoria</option>
            <option value="bank">Banco</option>
            <option value="type">Tipo</option>
            <option value="origin">Origem</option>
          </select>

          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as any)}
            className="
              w-28 py-2 px-3 rounded-xl text-sm
              bg-[#FBFAFF] dark:bg-[#181720]
              border border-[#E0DEED] dark:border-[#262433]
            "
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>

      {/* AÇÕES */}
      <div className="flex flex-wrap gap-4">

        {/* Botão Ordenar + SortMenu */}
        <div className="relative overflow-visible">
          <button
            className="
              rounded-xl px-4 py-2 flex items-center gap-2 text-sm
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
            toggle={() => setSortMenuOpen(false)}
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

        {/* Editar */}
        <button
          onClick={openEditSheetModal}
          className="
            px-4 py-2 rounded-xl border text-sm flex items-center gap-2
            bg-[#E6F0FF] text-[#2F4A8A] border-[#C3D7FF]
            hover:bg-[#dce9ff]
            dark:bg-[#1A1824] dark:border-[#2C2838] dark:text-[#C9D8FF]
            dark:hover:bg-[#2A2638]
          "
        >
          <Pencil size={16} />
          Editar
        </button>

        {/* Excluir */}
        <button
          onClick={deleteSheet}
          className="
            px-4 py-2 rounded-xl border text-sm flex items-center gap-2
            bg-red-50 text-red-600 border-red-200
            hover:bg-red-100
            dark:bg-[#2A1A1F] dark:text-red-300 dark:border-[#3A222A]
            dark:hover:bg-[#3A222A]
          "
        >
          <Trash2 size={16} />
          Excluir
        </button>

        {/* Novo Item */}
        <button
          onClick={openCreateItemModal}
          className="
            px-6 py-2 rounded-xl text-sm flex items-center gap-2 font-medium
            bg-[#7B61FF] text-white shadow-sm
            hover:bg-[#6A54E6]
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
