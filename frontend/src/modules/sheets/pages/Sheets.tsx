import { useState, useMemo } from "react";
import { Plus, ArrowUpDown, Search } from "lucide-react";

import { SheetCard } from "../components/SheetCard";
import { EditSheetModal } from "../components/EditSheetModal";
import { CreateSheetModal } from "../components/CreateSheetModal";
import { useSheets } from "../hooks/useSheets";

// debounce tipado
function debounce<T extends (...args: any[]) => void>(fn: T, delay = 300) {
  let t: any;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

export default function Sheets() {
  const {
    sheets,
    summaries,
    loading,
    search,
    setSearch,
    sortAsc,
    setSortAsc,
    createModalOpen,
    setCreateModalOpen,
    editModalOpen,
    setEditModalOpen,
    editForm,
    setEditForm,
    deleteSheet,
    openEditModal,
    saveEditSheet,
    addSheet,
  } = useSheets();

  const [localSearch, setLocalSearch] = useState(search);

  const debouncedSearch = useMemo(
    () =>
      debounce((text: string) => {
        setSearch(text);
      }, 350),
    [setSearch]
  );

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    debouncedSearch(value);
  };

  const filtered = useMemo(() => {
    let arr = [...sheets];

    if (search.trim() !== "") {
      const s = search.toLowerCase();
      arr = arr.filter((sheet) => sheet.name.toLowerCase().includes(s));
    }

    arr.sort((a, b) => {
      if (a.name < b.name) return sortAsc ? -1 : 1;
      if (a.name > b.name) return sortAsc ? 1 : -1;
      return 0;
    });

    return arr;
  }, [sheets, search, sortAsc]);

  return (
    <div className="animate-fadeIn space-y-10 pb-20">

      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl font-semibold text-[#2F2F36] dark:text-gray-100">
          Planilhas
        </h1>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-[#7B61FF] text-white px-5 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-[#6A54E6] transition shadow-sm hover:shadow-md"
        >
          <Plus size={18} />
          Nova Planilha
        </button>
      </div>

      <div className="bg-white dark:bg-[#14131A] border border-[#E4E2F0] dark:border-[#2A2932] rounded-3xl p-6 shadow-sm mb-10 flex items-center gap-4">
        
        <div className="flex items-center gap-2 flex-1 bg-[#FBFAFF] dark:bg-[#1E1E26] border border-[#E0DEED] dark:border-[#3A3A44] rounded-xl px-4 py-3 transition-colors">
          <Search size={18} className="text-gray-500 dark:text-gray-300" />

          <input
            type="text"
            placeholder="Buscar planilhas..."
            className="flex-1 bg-transparent focus:outline-none text-[#3A3A45] dark:text-gray-200 
                       placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:[color-scheme:dark]"
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <button
          onClick={() => setSortAsc((prev: boolean) => !prev)}
          className={`
            flex items-center gap-2 font-medium px-4 py-3 rounded-xl border transition
            text-[#7B61FF] dark:text-indigo-200
            ${
              sortAsc
                ? "bg-[#E7E0FF] border-[#D4CCFF] dark:bg-indigo-900/40 dark:border-indigo-800"
                : "bg-[#F0ECFF] border-[#E3DEFF] hover:bg-[#E7E0FF] dark:bg-indigo-900/20 dark:border-indigo-800"
            }
          `}
        >
          <ArrowUpDown size={16} />
          {sortAsc ? "A → Z" : "Z → A"}
        </button>
      </div>

      {loading && (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="relative bg-white dark:bg-dark-card border border-[#E6E1F7] dark:border-dark-border 
                         rounded-3xl p-6 shadow-sm overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#EDE7FF]/60 
                              to-transparent animate-shimmer dark:via-gray-700/20" />

              <div className="flex items-center justify-between">
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#F4F0FF] dark:bg-gray-800 
                                  border border-[#E6E1F7] dark:border-dark-border" />
                  
                  <div className="space-y-3">
                    <div className="h-4 w-40 bg-[#EEE9FA] dark:bg-gray-700 rounded-lg" />
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-24 bg-[#EEE9FA] dark:bg-gray-700 rounded-lg" />
                      <div className="h-3 w-20 bg-[#EEE9FA] dark:bg-gray-700 rounded-lg" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-20 bg-[#F3EEFF] dark:bg-gray-700 rounded-xl border border-[#E6E1F7] dark:border-dark-border" />
                  <div className="h-8 w-20 bg-[#FFEAEA] dark:bg-gray-700 rounded-xl border border-red-200 dark:border-red-800" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div
                    key={j}
                    className="bg-[#F5F4FA] dark:bg-dark-card border border-[#E1E0EB] dark:border-dark-border 
                               rounded-3xl p-5 shadow-inner"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-20 bg-[#E7E5F3] dark:bg-gray-700 rounded-md" />
                      <div className="h-5 w-5 bg-[#E7E5F3] dark:bg-gray-700 rounded-lg" />
                    </div>

                    <div className="h-6 w-24 bg-[#DED9F3] dark:bg-gray-700 rounded-md mt-4" />
                    <div className="h-[4px] rounded-full bg-[#CFC8ED] dark:bg-gray-700 mt-4" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="flex flex-col gap-6">
          {filtered.map((sheet) => (
            <SheetCard
              key={sheet.id}
              sheet={sheet}
              summary={summaries[sheet.id]}
              onDelete={() => deleteSheet(sheet.id)}
              onEdit={() => openEditModal(sheet)}
            />
          ))}

          {filtered.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-300 text-center mt-10">
              Nenhuma planilha encontrada.
            </p>
          )}
        </div>
      )}

      {createModalOpen && (
        <CreateSheetModal
          onClose={() => setCreateModalOpen(false)}
          onCreated={(sheet) => addSheet(sheet)}
        />
      )}

      {editModalOpen && (
        <EditSheetModal
          form={editForm}
          setForm={setEditForm}
          onClose={() => setEditModalOpen(false)}
          onSave={saveEditSheet}
        />
      )}
    </div>
  );
}
