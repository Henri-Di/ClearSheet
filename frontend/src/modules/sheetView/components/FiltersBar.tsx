import { Search } from "lucide-react";

interface Props {
  search: string;
  setSearch: (v: string) => void;
}

export default function FiltersBar({ search, setSearch }: Props) {
  return (
    <div
      className="
        bg-white border border-[#E6E1F7] rounded-3xl 
        p-4 md:p-6 shadow-sm
        flex flex-col md:flex-row gap-4 md:items-center md:justify-between
      "
    >

      <div className="relative w-full md:w-80">
        <Search size={18} className="absolute left-3 top-3 text-gray-400" />

        <input
          type="text"
          placeholder="Buscar por descrição, categoria, banco..."
          className="
            w-full bg-[#FBFAFF] border border-[#E0DEED] rounded-xl 
            pl-10 pr-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/50
          "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
