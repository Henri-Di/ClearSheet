import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Search,
  XCircle,
  ArrowUpDown,
  SlidersHorizontal,
} from "lucide-react";

import type { Filters } from "../types/Filters";
import type { Category } from "../types/Category";
import type { Bank } from "../types/Bank";

interface Props {
  filters: Filters;
  setFilters: (f: Filters) => void;
  categories?: Category[];
  banks?: Bank[];
}

export function FiltersBar({
  filters,
  setFilters,
  categories = [],
  banks = [],
}: Props) {
  const [open, setOpen] = useState(true);

  function update(field: keyof Filters, value: any) {
    setFilters({ ...filters, [field]: value });
  }

  function clearAll() {
    setFilters({
      search: "",
      dateStart: "",
      dateEnd: "",
      sortField: "date",
      sortDirection: "desc",
      category: "",
      bank: "",
      type: "",
      paid: "",
      minValue: "",
      maxValue: "",
    });
  }

  function toggleSortDirection() {
    update("sortDirection", filters.sortDirection === "asc" ? "desc" : "asc");
  }

  return (
    <div className="flex flex-col gap-4 w-full">

      <div className="flex justify-between items-center">
        <button
          onClick={() => setOpen(!open)}
          className="
            flex items-center gap-2 px-4 py-2 rounded-2xl text-sm
            bg-[#EFEAFF] dark:bg-white/10
            text-[#6B54FF] dark:text-[#CFC4FF]
            border border-[#E6E1F7] dark:border-white/10
            shadow-sm hover:shadow-md transition-all
          "
        >
          <SlidersHorizontal size={16} />
          {open ? "Esconder filtros" : "Mostrar filtros"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="filters-box"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >

    
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="
                flex items-center gap-3 p-3 rounded-2xl w-full
                border border-[#E6E1F7] dark:border-white/10
                bg-[#F7F7FF] dark:bg-white/5
                shadow-sm hover:shadow-md transition-all
              "
            >
              <Search className="text-[#7B61FF] dark:text-[#B6A8FF]" size={18} />
              <input
                className="
                  bg-transparent flex-1 outline-none text-sm
                  text-gray-800 dark:text-gray-200
                  placeholder-gray-400 dark:placeholder-gray-500
                "
                placeholder="Pesquisar transações..."
                value={filters.search}
                onChange={(e) => update("search", e.target.value)}
              />
            </motion.div>


            <div className="flex gap-3 flex-wrap w-full">
              <FilterBox>
                <FilterLabel icon={<Calendar size={14} />}>De</FilterLabel>
                <input
                  type="date"
                  value={filters.dateStart}
                  onChange={(e) => update("dateStart", e.target.value)}
                  className="filter-input"
                />
              </FilterBox>

              <FilterBox delay={0.05}>
                <FilterLabel icon={<Calendar size={14} />}>Até</FilterLabel>
                <input
                  type="date"
                  value={filters.dateEnd}
                  onChange={(e) => update("dateEnd", e.target.value)}
                  className="filter-input"
                />
              </FilterBox>
            </div>


        
            <div className="flex gap-3 flex-wrap w-full">
              <FilterBox>
                <FilterLabel>Categoria</FilterLabel>
                <select
                  value={filters.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="filter-select"
                >
                  <option value="">Todas</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </FilterBox>

              <FilterBox delay={0.03}>
                <FilterLabel>Banco</FilterLabel>
                <select
                  value={filters.bank}
                  onChange={(e) => update("bank", e.target.value)}
                  className="filter-select"
                >
                  <option value="">Todos</option>
                  {banks.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </FilterBox>

              <FilterBox delay={0.06}>
                <FilterLabel>Tipo</FilterLabel>
                <select
                  value={filters.type}
                  onChange={(e) => update("type", e.target.value)}
                  className="filter-select"
                >
                  <option value="">Todos</option>
                  <option value="income">Entradas</option>
                  <option value="expense">Saídas</option>
                </select>
              </FilterBox>

              <FilterBox delay={0.09}>
                <FilterLabel>Pagamento</FilterLabel>
                <select
                  value={filters.paid}
                  onChange={(e) => update("paid", e.target.value)}
                  className="filter-select"
                >
                  <option value="">Todos</option>
                  <option value="yes">Pagos</option>
                  <option value="no">Não pagos</option>
                </select>
              </FilterBox>
            </div>


     
            <div className="flex gap-3 flex-wrap w-full">

              <FilterBox>
                <FilterLabel>Valor mínimo</FilterLabel>
                <input
                  type="number"
                  value={filters.minValue}
                  onChange={(e) => update("minValue", e.target.value)}
                  className="filter-input"
                />
              </FilterBox>

              <FilterBox delay={0.04}>
                <FilterLabel>Valor máximo</FilterLabel>
                <input
                  type="number"
                  value={filters.maxValue}
                  onChange={(e) => update("maxValue", e.target.value)}
                  className="filter-input"
                />
              </FilterBox>

              <FilterBox delay={0.07}>
                <FilterLabel>Ordenar por</FilterLabel>
                <select
                  value={filters.sortField}
                  onChange={(e) => update("sortField", e.target.value)}
                  className="filter-select"
                >
                  <option value="date">Data</option>
                  <option value="value">Valor</option>
                  <option value="category">Categoria</option>
                  <option value="bank">Banco</option>
                </select>
              </FilterBox>

              <FilterBox delay={0.1}>
                <FilterLabel>Direção</FilterLabel>
                <button
                  onClick={toggleSortDirection}
                  className="
                    p-2 rounded-xl border border-[#E6E1F7]
                    dark:border-white/10 bg-white dark:bg-white/5
                    hover:bg-[#F0EDFF] dark:hover:bg-white/10 transition
                    flex items-center justify-center text-sm
                  "
                >
                  <ArrowUpDown
                    size={16}
                    className="text-[#7B61FF] dark:text-[#B6A8FF]"
                  />
                  {filters.sortDirection === "asc"
                    ? " Crescente"
                    : " Decrescente"}
                </button>
              </FilterBox>
            </div>


            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={clearAll}
              className="
                mt-2 self-end px-4 py-2 rounded-2xl text-sm
                bg-[#EFEAFF] dark:bg-white/10
                text-[#6B54FF] dark:text-[#CFC4FF]
                border border-[#E6E1F7] dark:border-white/10
                shadow-sm hover:shadow-md transition-all
                flex items-center gap-2
              "
            >
              <XCircle size={16} /> Limpar filtros
            </motion.button>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}



function FilterBox({ children, delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay }}
      className="
        p-3 rounded-2xl min-w-[140px] flex-1
        border border-[#E6E1F7] dark:border-white/10
        bg-white dark:bg-white/5 shadow-sm hover:shadow-md
        transition-all
      "
    >
      {children}
    </motion.div>
  );
}

function FilterLabel({ children, icon }: any) {
  return (
    <label className="text-xs text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-1">
      {icon} {children}
    </label>
  );
}
