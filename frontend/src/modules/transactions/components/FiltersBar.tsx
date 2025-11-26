import { Calendar, Search } from "lucide-react";

export function FiltersBar({ filters, setFilters }: any) {
  return (
    <div className="flex flex-col gap-4 text-inherit">


      <div
        className="
          flex items-center gap-3 p-3 rounded-2xl
          border border-[#E1E0EB] dark:border-dark-border
          bg-[#F7F7FF] dark:bg-dark-card
          shadow-sm transition-all
        "
        title="Digite para filtrar por descrição, categoria, banco, valor ou status"
      >
        <Search
          className="text-[#7B61FF] dark:text-[#9d8aff]"
          size={18}
        />

        <input
          className="
            bg-transparent flex-1 outline-none 
            text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500
          "
          placeholder="Pesquisar transações..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
        />
      </div>

      <div className="flex gap-3 flex-wrap">

        <div
          className="
            flex flex-col p-3 rounded-2xl min-w-[160px]
            border border-[#E1E0EB] dark:border-dark-border
            bg-white dark:bg-dark-card
            shadow-sm transition-all
          "
          title="Filtrar transações a partir desta data"
        >
          <label className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1 mb-1">
            <Calendar size={14} className="text-gray-600 dark:text-gray-300" />
            De
          </label>

          <input
            type="date"
            value={filters.dateStart}
            onChange={(e) =>
              setFilters({ ...filters, dateStart: e.target.value })
            }
            className="
              outline-none bg-transparent text-sm 
              text-gray-800 dark:text-gray-200
            "
          />
        </div>

        <div
          className="
            flex flex-col p-3 rounded-2xl min-w-[160px]
            border border-[#E1E0EB] dark:border-dark-border
            bg-white dark:bg-dark-card
            shadow-sm transition-all
          "
          title="Filtrar transações até esta data"
        >
          <label className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1 mb-1">
            <Calendar size={14} className="text-gray-600 dark:text-gray-300" />
            Até
          </label>

          <input
            type="date"
            value={filters.dateEnd}
            onChange={(e) =>
              setFilters({ ...filters, dateEnd: e.target.value })
            }
            className="
              outline-none bg-transparent text-sm
              text-gray-800 dark:text-gray-200
            "
          />
        </div>

      </div>
    </div>
  );
}
