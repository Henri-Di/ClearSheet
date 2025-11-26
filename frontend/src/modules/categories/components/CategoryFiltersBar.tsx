import { Search } from "lucide-react";
import { CATEGORY_ICONS } from "../utils/categoryIcons";

export type CategorySortType = "asc" | "desc" | "none";

interface CategoryFiltersBarProps {
  search: string;
  setSearch: (v: string) => void;

  iconFilter: string;
  setIconFilter: (v: string) => void;

  sort: CategorySortType;
  setSort: (v: CategorySortType) => void;
}

export function CategoryFiltersBar({
  search,
  setSearch,
  iconFilter,
  setIconFilter,
  sort,
  setSort,
}: CategoryFiltersBarProps) {
  return (
    <div className="flex flex-col gap-4">

      {/* BUSCA */}
      <div
        className="
          flex items-center gap-2
          bg-white dark:bg-dark-input
          border border-[#E6E1F7] dark:border-dark-border
          rounded-xl px-3 py-2 shadow-sm
          transition-all duration-300
          focus-within:ring-2 focus-within:ring-[#7B61FF]
          hover:shadow-md hover:border-[#d5cef5]
          dark:hover:border-[#2e2c38]
        "
      >
        <Search
          size={16}
          className="
            text-gray-400 dark:text-gray-300 
            transition-colors duration-300
            group-hover:text-[#7B61FF]
          "
        />

        <input
          className="
            flex-1 outline-none text-sm bg-transparent
            text-[#2F2F36] dark:text-gray-200
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            transition-all duration-300
          "
          placeholder="Buscar categoria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* SELECTS */}
      <div className="flex gap-3">

        {/* SELECT ÍCONES */}
        <select
          className="
            flex-1
            bg-white dark:bg-dark-input
            text-[#2F2F36] dark:text-gray-200
            border border-[#E6E1F7] dark:border-dark-border
            rounded-xl px-3 py-2 text-sm outline-none shadow-sm
            transition-all duration-300
            focus:ring-2 focus:ring-[#7B61FF]
            hover:shadow-md hover:border-[#d5cef5]
            dark:hover:border-[#2e2c38]
            cursor-pointer
          "
          value={iconFilter}
          onChange={(e) => setIconFilter(e.target.value)}
        >
          <option value="" className="bg-white dark:bg-[#1B1A21] dark:text-white">
            Todos os ícones
          </option>

          {CATEGORY_ICONS.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-white dark:bg-[#1B1A21] dark:text-gray-200"
            >
              {opt.label}
            </option>
          ))}
        </select>

        {/* SELECT ORDEM */}
        <select
          className="
            w-32
            bg-white dark:bg-dark-input
            text-[#2F2F36] dark:text-gray-200
            border border-[#E6E1F7] dark:border-dark-border
            rounded-xl px-3 py-2 text-sm outline-none shadow-sm
            transition-all duration-300
            focus:ring-2 focus:ring-[#7B61FF]
            hover:shadow-md hover:border-[#d5cef5]
            dark:hover:border-[#2e2c38]
            cursor-pointer
          "
          value={sort}
          onChange={(e) => setSort(e.target.value as CategorySortType)}
        >
          <option value="none" className="bg-white dark:bg-[#1B1A21] dark:text-white">
            Padrão
          </option>
          <option value="asc" className="bg-white dark:bg-[#1B1A21] dark:text-white">
            A-Z
          </option>
          <option value="desc" className="bg-white dark:bg-[#1B1A21] dark:text-white">
            Z-A
          </option>
        </select>

      </div>
    </div>
  );
}
