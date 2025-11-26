import { Search, Calendar } from "lucide-react";

interface LinkedSheetsFiltersBarProps {
  search: string;
  setSearch: (v: string) => void;

  month: string;
  setMonth: (v: string) => void;

  year: string;
  setYear: (v: string) => void;
}

export function LinkedSheetsFiltersBar({
  search,
  setSearch,
  month,
  setMonth,
  year,
  setYear,
}: LinkedSheetsFiltersBarProps) {
  return (
    <div
      className="
        flex flex-col lg:flex-row lg:items-center gap-4
        bg-white dark:bg-dark-card
        border border-[#E6E1F7] dark:border-dark-border
        rounded-2xl p-4 shadow-sm
        transition-colors
      "
    >

      <div
        className="
          flex items-center gap-2 flex-1
          bg-white dark:bg-dark-input
          px-4 py-2 border border-[#E6E1F7] dark:border-dark-border
          rounded-xl shadow-sm
          focus-within:ring-2 focus-within:ring-[#7B61FF]
          transition-colors
        "
      >
        <Search
          size={18}
          className="text-gray-400 dark:text-gray-300"
        />

        <input
          className="
            w-full bg-transparent outline-none text-sm
            text-[#2F2F36] dark:text-gray-200
            placeholder:text-gray-400 dark:placeholder:text-gray-500
          "
          placeholder="Pesquisar planilhas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>


      <div
        className="
          flex items-center gap-2
          bg-white dark:bg-dark-input
          px-4 py-2 border border-[#E6E1F7] dark:border-dark-border
          rounded-xl shadow-sm
          focus-within:ring-2 focus-within:ring-[#7B61FF]
          transition-colors
        "
      >
        <Calendar
          size={16}
          className="text-[#7B61FF] dark:text-indigo-300"
        />

        <select
          className="
            bg-transparent outline-none text-sm cursor-pointer
            text-[#2F2F36] dark:text-gray-200
            dark:bg-dark-input
          "
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          <option value="">Mês</option>

          {Array.from({ length: 12 }).map((_, i) => {
            const m = String(i + 1);
            return (
              <option key={m} value={m}>
                {m}
              </option>
            );
          })}
        </select>
      </div>


      <div
        className="
          flex items-center gap-2
          bg-white dark:bg-dark-input
          px-4 py-2 border border-[#E6E1F7] dark:border-dark-border
          rounded-xl shadow-sm
          focus-within:ring-2 focus-within:ring-[#7B61FF]
          transition-colors
        "
      >
        <Calendar
          size={16}
          className="text-[#7B61FF] dark:text-indigo-300"
        />

        <input
          type="number"
          className="
            bg-transparent outline-none text-sm w-24
            text-[#2F2F36] dark:text-gray-200
            placeholder:text-gray-400 dark:placeholder:text-gray-500
          "
          placeholder="Ano"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>

    </div>
  );
}
