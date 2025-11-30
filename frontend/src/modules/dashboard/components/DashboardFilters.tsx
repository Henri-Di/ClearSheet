import { useEffect, useState } from "react";
import {
  Calendar,
  Filter,
  ChevronDown,
  ArrowUpDown,
  Tag,
  Check,
  X,
  Search
} from "lucide-react";

import { createPortal } from "react-dom";

interface Props {
  period: string;
  setPeriod: (v: string) => void;

  type: string;
  setType: (v: string) => void;

  order: string;
  setOrder: (v: string) => void;

  categories: any[];
  selectedCategories: string[];
  setSelectedCategories: (v: string[]) => void;
}

export function DashboardFilters({
  period,
  setPeriod,
  type,
  setType,
  order,
  setOrder,
  categories,
  selectedCategories,
  setSelectedCategories
}: Props) {
  const [openCatModal, setOpenCatModal] = useState(false);
  const [catSearch, setCatSearch] = useState("");
  const [modalRootEl, setModalRootEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const root = document.getElementById("modal-root");
    setModalRootEl(root);
  }, []);

  const basePill =
    "px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 " +
    "transition-all cursor-pointer select-none whitespace-nowrap " +
    "bg-white/80 border border-[#E6E1F7] shadow-sm " +
    "hover:bg-[#F5F2FF] hover:border-[#D7D0FF] " +
    "dark:bg-[#1A1824]/80 dark:border-[#2C2838] " +
    "dark:hover:bg-[#241F33] dark:hover:border-[#3A334B]";

  const activePill =
    "text-[#7B61FF] border-[#C9BFFF] bg-[#F4F0FF] " +
    "dark:bg-[#241F33] dark:border-[#3A334B] dark:text-[#B7A4FF]";

  const safeId = (c: any) =>
    String(c.id ?? c.uuid ?? c.slug ?? c.name ?? c.label);

  const filteredCategories = categories.filter((c) =>
    (c.name ?? "").toLowerCase().includes(catSearch.toLowerCase())
  );

  const toggleCategory = (id: string) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((x) => x !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const selectAll = () => {
    setSelectedCategories(categories.map((c) => safeId(c)));
  };

  const clearAll = () => {
    setSelectedCategories([]);
  };


  const Modal = modalRootEl
    ? createPortal(
        <div
          className="
            fixed inset-0 z-[9999] flex items-center justify-center
            bg-black/40 backdrop-blur-sm animate-fadeIn
          "
        >
          <div
            className="
              w-full max-w-lg rounded-3xl p-6 shadow-[0_8px_40px_rgba(0,0,0,0.15)]
              animate-slideUp
              bg-white border border-[#E6E1F7]
              dark:bg-[#1A1824] dark:border-[#2C2838]
            "
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#2F2F36] dark:text-gray-200">
                Selecionar Categorias
              </h2>

              <button
                onClick={() => setOpenCatModal(false)}
                className="
                  p-2 rounded-lg 
                  hover:bg-black/10 
                  dark:hover:bg-white/10
                  transition
                "
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative mb-4">
              <Search
                size={16}
                className="absolute left-3 top-3 text-gray-400 dark:text-gray-500"
              />
              <input
                value={catSearch}
                onChange={(e) => setCatSearch(e.target.value)}
                placeholder="Buscar categoria..."
                className="
                  w-full pl-10 pr-3 py-2 text-sm rounded-xl
                  bg-[#FBFAFF] border border-[#E0DEED]
                  dark:bg-[#181720] dark:border-[#262433]
                  focus:ring-2 focus:ring-[#C7BBFF]
                  dark:focus:ring-[#4A3D6B]
                "
              />
            </div>

            <div
              className="
                max-h-72 overflow-y-auto pr-1 mb-5
                scrollbar-thin scrollbar-thumb-[#D0C7FF]
                dark:scrollbar-thumb-[#3A334B]
              "
            >
              {filteredCategories.map((c) => {
                const id = safeId(c);
                const active = selectedCategories.includes(id);

                return (
                  <div
                    key={id}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-xl mb-1 transition-all cursor-pointer
                      ${
                        active
                          ? "bg-[#F4F0FF] dark:bg-[#241F33] border border-[#D4C8FF]/40"
                          : "hover:bg-[#F7F4FF] dark:hover:bg-[#241F33]"
                      }
                    `}
                    onClick={() => toggleCategory(id)}
                  >
                    <div
                      className={`
                        w-5 h-5 rounded-md flex items-center justify-center border
                        ${
                          active
                            ? "bg-[#7B61FF] border-[#6A54E6]"
                            : "bg-white/10 dark:bg-[#1A1824] border-[#C4BAFF] dark:border-[#3A334B]"
                        }
                      `}
                    >
                      {active && <Check size={14} className="text-white" />}
                    </div>

                    <span className="text-sm text-[#2F2F36] dark:text-gray-200">
                      {c.name}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-black/5 dark:border-white/5">
              <button
                className="
                  px-4 py-2 text-sm rounded-xl
                  bg-[#F4F0FF] text-[#7B61FF]
                  dark:bg-[#241F33] dark:text-[#B7A4FF]
                "
                onClick={selectAll}
              >
                Selecionar tudo
              </button>

              <button
                className="
                  px-4 py-2 text-sm rounded-xl
                  bg-red-50 text-red-600
                  dark:bg-[#2A1A1F] dark:text-red-300
                "
                onClick={clearAll}
              >
                Limpar
              </button>

              <button
                className="
                  px-5 py-2 text-sm rounded-xl shadow-sm
                  bg-[#7B61FF] text-white
                  hover:bg-[#6A54E6]
                  transition
                "
                onClick={() => setOpenCatModal(false)}
              >
                Concluir
              </button>
            </div>
          </div>
        </div>,
        modalRootEl
      )
    : null;


  return (
    <>
      <div
        className="
          flex items-center gap-3 overflow-x-auto pb-1
          scrollbar-thin scrollbar-thumb-[#D0C7FF]
          dark:scrollbar-thumb-[#3A334B]
        "
      >
        <button
          className={`${basePill} ${period !== "all" ? activePill : ""}`}
          onClick={() => {
            const order = ["3m", "6m", "year", "lastyear", "all"];
            const next = order[(order.indexOf(period) + 1) % order.length];
            setPeriod(next);
          }}
        >
          <Calendar size={16} />
          {period === "3m" && "Últimos 3 meses"}
          {period === "6m" && "Últimos 6 meses"}
          {period === "year" && "Ano atual"}
          {period === "lastyear" && "Ano anterior"}
          {period === "all" && "Todo período"}
          <ChevronDown size={14} className="opacity-60" />
        </button>

        <button
          className={`${basePill} ${type !== "all" ? activePill : ""}`}
          onClick={() => {
            const list = ["all", "income", "expense"];
            const next = list[(list.indexOf(type) + 1) % list.length];
            setType(next);
          }}
        >
          <Filter size={16} />
          {type === "all" && "Entradas + Saídas"}
          {type === "income" && "Somente Entradas"}
          {type === "expense" && "Somente Saídas"}
          <ChevronDown size={14} className="opacity-60" />
        </button>

        <button
          className={`${basePill} ${order !== "none" ? activePill : ""}`}
          onClick={() => {
            const list = ["none", "high", "low", "az", "za"];
            const next = list[(list.indexOf(order) + 1) % list.length];
            setOrder(next);
          }}
        >
          <ArrowUpDown size={16} />
          {order === "none" && "Sem ordenação"}
          {order === "high" && "Maior valor"}
          {order === "low" && "Menor valor"}
          {order === "az" && "A → Z"}
          {order === "za" && "Z → A"}
          <ChevronDown size={14} className="opacity-60" />
        </button>

        <button
          className={`${basePill} ${
            selectedCategories.length > 0 ? activePill : ""
          }`}
          onClick={() => setOpenCatModal(true)}
        >
          <Tag size={16} />
          {selectedCategories.length === 0
            ? "Todas categorias"
            : `${selectedCategories.length} selecionada(s)`}
          <ChevronDown size={14} className="opacity-60" />
        </button>
      </div>

      {openCatModal && Modal}
    </>
  );
}
