import { motion } from "framer-motion";
import { Calendar, Search } from "lucide-react";

export function FiltersBar({ filters, setFilters }: any) {
  return (
    <div className="flex flex-col gap-4 text-inherit w-full">

      
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
        title="Digite para filtrar por descrição, categoria, banco, valor ou status"
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
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
        />
      </motion.div>

   
      <div className="flex gap-3 flex-wrap w-full">

       <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="
            flex flex-col p-3 rounded-2xl min-w-[160px] flex-1
            border border-[#E6E1F7] dark:border-white/10
            bg-white dark:bg-white/5
            shadow-sm hover:shadow-md transition-all
          "
          title="Filtrar transações a partir desta data"
        >
          <label className="
            text-xs text-gray-600 dark:text-gray-300
            flex items-center gap-1 mb-1
          ">
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
              [&::-webkit-calendar-picker-indicator]:invert-[0.2]
              dark:[&::-webkit-calendar-picker-indicator]:invert-[0.8]
            "
          />
        </motion.div>

        {/* DATE END */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: 0.05 }}
          className="
            flex flex-col p-3 rounded-2xl min-w-[160px] flex-1
            border border-[#E6E1F7] dark:border-white/10
            bg-white dark:bg-white/5
            shadow-sm hover:shadow-md transition-all
          "
          title="Filtrar transações até esta data"
        >
          <label className="
            text-xs text-gray-600 dark:text-gray-300
            flex items-center gap-1 mb-1
          ">
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
              [&::-webkit-calendar-picker-indicator]:invert-[0.2]
              dark:[&::-webkit-calendar-picker-indicator]:invert-[0.8]
            "
          />
        </motion.div>

      </div>
    </div>
  );
}
