import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
} from "lucide-react";

interface Props {
  search: string;
  setSearch: (v: string) => void;

  category?: string;
  setCategory?: (v: string) => void;

  bank?: string;
  setBank?: (v: string) => void;

  sort?: string;
  setSort?: (v: string) => void;

  categoriesList?: { id: number; name: string }[];
  banksList?: { id: number; name: string }[];
}

export default function FiltersBar({
  search,
  setSearch,

  category = "",
  setCategory,

  bank = "",
  setBank,

  sort = "date",
  setSort,

  categoriesList = [],
  banksList = [],
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="
        bg-white dark:bg-[#1a1625]
        border border-[#E6E1F7] dark:border-white/10 
        rounded-3xl p-4 md:p-6 shadow-sm
        flex flex-col gap-4
      "
    >
      {/* HEADER + BOTÃO */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
          <Filter size={16} className="text-[#7B61FF]" />
          Filtros
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="
            flex items-center gap-2 px-3 py-2 rounded-xl text-xs
            bg-[#EFEAFF] dark:bg-white/10
            text-[#6B54FF] dark:text-[#CFC4FF]
            border border-[#E6E1F7] dark:border-white/10
            shadow-sm hover:shadow-md transition-all
          "
        >
          <SlidersHorizontal size={14} />
          {open ? "Ocultar" : "Avançado"}
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative w-full">
        <Search
          size={18}
          className="absolute left-3 top-3 text-gray-400 dark:text-gray-600"
        />

        <input
          type="text"
          placeholder="Buscar por descrição, categoria, banco..."
          className="
            w-full bg-[#FBFAFF] dark:bg-white/5
            border border-[#E0DEED] dark:border-white/10
            text-gray-800 dark:text-gray-200
            rounded-xl pl-10 pr-3 py-2 text-sm shadow-sm
            focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/50
          "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ÁREA EXPANDIDA */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="advanced"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="
              overflow-hidden
              pt-2
            "
          >
            <div
              className="
                grid grid-cols-1 md:grid-cols-3 gap-3
              "
            >
              {/* CATEGORIA */}
              {setCategory && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600 dark:text-gray-300">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="
                      bg-white dark:bg-white/5
                      border border-[#E6E1F7] dark:border-white/10
                      rounded-xl text-sm px-3 py-2
                      text-gray-800 dark:text-gray-200
                      shadow-sm focus:ring-2 focus:ring-[#7B61FF]/40
                    "
                  >
                    <option value="">Todas</option>
                    {categoriesList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* BANCO */}
              {setBank && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600 dark:text-gray-300">
                    Banco
                  </label>
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="
                      bg-white dark:bg-white/5
                      border border-[#E6E1F7] dark:border-white/10
                      rounded-xl text-sm px-3 py-2
                      text-gray-800 dark:text-gray-200
                      shadow-sm focus:ring-2 focus:ring-[#7B61FF]/40
                    "
                  >
                    <option value="">Todos</option>
                    {banksList.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* ORDENAR */}
              {setSort && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600 dark:text-gray-300">
                    Ordenar por
                  </label>

                  <div className="relative">
                    <ArrowUpDown
                      size={16}
                      className="absolute right-3 top-2.5 text-gray-400 dark:text-gray-500"
                    />

                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="
                        w-full bg-white dark:bg-white/5
                        border border-[#E6E1F7] dark:border-white/10
                        rounded-xl text-sm px-3 py-2 pr-9
                        text-gray-800 dark:text-gray-200
                        shadow-sm focus:ring-2 focus:ring-[#7B61FF]/40
                      "
                    >
                      <option value="date">Data</option>
                      <option value="value">Valor</option>
                      <option value="category">Categoria</option>
                      <option value="bank">Banco</option>
                      <option value="type">Tipo</option>
                      <option value="origin">Origem</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
