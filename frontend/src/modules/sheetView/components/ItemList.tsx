import { useState, useRef } from "react";
import { ItemRow } from "./ItemRow";
import EmptyState from "./EmptyState";

import {
  Trash2,
  Edit2,
  CheckCircle2,
  Calendar,
  Banknote,
} from "lucide-react";

import type { UnifiedItem, Bank, Category } from "../types/sheet";

interface Props {
  items: UnifiedItem[];
  banks: Bank[];
  categories: Category[];
  loading: boolean;

  lastUpdatedKey: string | null;
  updatingInlineKey: string | null;

  updateLocalItemField: (
    item: UnifiedItem,
    field:
      | "value"
      | "category_id"
      | "bank_id"
      | "type"
      | "date"
      | "description"
      | "paid_at",
    value: any
  ) => void;

  updateInline: (
    item: UnifiedItem,
    field:
      | "value"
      | "category_id"
      | "bank_id"
      | "type"
      | "date"
      | "description"
      | "paid_at",
    value: any
  ) => Promise<void>;

  deleteInline: (item: UnifiedItem) => Promise<void>;
  openEditItemModal: (item: UnifiedItem) => void;

  getTodayIso: () => string;
}

export default function ItemsList(props: Props) {
  const {
    items,
    banks,
    categories,
    loading,
    lastUpdatedKey,
    updatingInlineKey,
    updateLocalItemField,
    updateInline,
    deleteInline,
    openEditItemModal,
    getTodayIso,
  } = props;


  if (loading) {
    return (
      <div
        className="
          rounded-3xl overflow-x-auto relative
          bg-white border border-[#E6E1F7] shadow
          dark:bg-[#13111B] dark:border-[#1F1C2A] dark:shadow-xl
          max-h-[70vh] overflow-y-auto custom-scroll
        "
      >
       
        <div
          className="
            absolute inset-0 z-10 pointer-events-none
            bg-gradient-to-r from-transparent via-[#EDE7FF]/50 to-transparent
            animate-shimmer dark:hidden
          "
        />
    
        <div
          className="
            hidden dark:block absolute inset-0 z-10 pointer-events-none
            bg-gradient-to-r from-transparent via-[#2B2740]/40 to-transparent
            animate-shimmer
          "
        />
        <table className="w-full min-w-[1400px] relative z-20">
          <tbody>
            {[...Array(6)].map((_, i) => (
              <tr
                key={i}
                className="border-b border-[#F0ECFF] dark:border-[#1B1824]"
              >
                <td className="py-6 px-4">
                  <div className="h-10 w-full rounded-xl bg-[#eee] dark:bg-[#2A2638]" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nenhum item encontrado"
        subtitle="Adicione um novo item para começar sua planilha."
      />
    );
  }

  const grouped = groupByDate(items);

  function groupByDate(list: UnifiedItem[]) {
    const map: Record<string, UnifiedItem[]> = {};
    list.forEach((item) => {
      const label = item.date ? item.date : "sem-data";
      if (!map[label]) map[label] = [];
      map[label] = [...map[label], item];
    });
    return map;
  }

  return (
    <>
      <div className="block sm:hidden space-y-8">
        {Object.keys(grouped)
          .sort()
          .map((date) => (
            <div key={date}>
              {/* Group Header */}
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                <Calendar size={14} />
                {date === "sem-data" ? "Sem data" : formatBrDate(date)}
              </div>

              <div className="space-y-4">
                {grouped[date].map((item) => {
                  const key = `${item.origin}-${item.id}`;
                  const isUpdating = updatingInlineKey === key;
                  const isUpdated = lastUpdatedKey === key;

                  return (
                    <MobileCard
                      key={key}
                      item={item}
                      banks={banks}
                      categories={categories}
                      isUpdating={isUpdating}
                      isUpdated={isUpdated}
                      updateInline={updateInline}
                      deleteInline={deleteInline}
                      openEditItemModal={openEditItemModal}
                      getTodayIso={getTodayIso}
                    />
                  );
                })}
              </div>
            </div>
          ))}
      </div>


      <div
        className="
          hidden sm:block rounded-3xl overflow-x-auto
          bg-white border border-[#E6E1F7] shadow
          dark:bg-[#13111B] dark:border-[#1F1C2A]
          max-h-[70vh] overflow-y-auto custom-scroll
        "
      >
        <table className="w-full min-w-[1400px]">
          <thead className="sticky top-0 z-30 bg-[#F5F2FF] border-b border-[#E6E1F7] dark:hidden shadow-sm">
            <tr className="text-gray-700 text-[13px] font-semibold">
              <th className="py-3 px-3 w-10 text-center">#</th>
              <th className="py-3 px-3 w-[34%] text-left">Descrição</th>
              <th className="py-3 px-3 w-[20%] text-left">Categoria</th>
              <th className="py-3 px-3 w-[12%] text-left">Valor</th>
              <th className="py-3 px-3 w-[18%] text-left">Data</th>
              <th className="py-3 px-3 w-[10%] text-left">Status</th>
              <th className="py-3 px-3 w-[16%] text-left">Banco</th>
              <th className="py-3 px-3 w-32 text-right pr-6">Ações</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <ItemRow
                key={`${item.origin}-${item.id}`}
                item={item}
                index={index}
                banks={banks}
                categories={categories}
                updatingInlineKey={updatingInlineKey}
                lastUpdatedKey={lastUpdatedKey}
                updateLocalItemField={updateLocalItemField}
                updateInline={updateInline}
                deleteInline={deleteInline}
                openEditItemModal={openEditItemModal}
                getTodayIso={getTodayIso}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* =======================================================================
    COMPONENTE — MOBILE ADVANCED CARD
======================================================================= */
function MobileCard({
  item,
  isUpdating,
  isUpdated,
  updateInline,
  deleteInline,
  openEditItemModal,
  getTodayIso,
}: any) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  /* Swipe left to delete */
  const [offset, setOffset] = useState(0);
  const startX = useRef(0);
  const dragging = useRef(false);

  function handleTouchStart(e: any) {
    startX.current = e.touches[0].clientX;
    dragging.current = true;
  }

  function handleTouchMove(e: any) {
    if (!dragging.current) return;
    const delta = e.touches[0].clientX - startX.current;
    if (delta < 0) setOffset(delta);
  }

  function handleTouchEnd() {
    dragging.current = false;
    if (offset < -80) {
      deleteInline(item);
    }
    setOffset(0);
  }

  /* Status badge */
  const status =
    item.paid_at
      ? { label: "Pago", class: "badge-paid", icon: <CheckCircle2 size={14} /> }
      : item.date < getTodayIso()
        ? { label: "Vencido", class: "badge-overdue" }
        : { label: "A vencer", class: "badge-due" };

  return (
    <div
      ref={cardRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ transform: `translateX(${offset}px)` }}
      className={`
        p-4 rounded-2xl bg-white dark:bg-[#1A1623]
        border border-[#E6E1F7] dark:border-[#1F1C2A]
        shadow-sm dark:shadow-lg relative
        transition-all duration-300

        ${isUpdating ? "opacity-50 blur-[1px]" : ""}
        ${isUpdated ? "ring-2 ring-[#7B61FF] ring-offset-2" : ""}
        animate-slide-up
      `}
    >
      {/* Descrição */}
      <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">
        {item.description || "(Sem descrição)"}
      </div>

      {/* Categoria + Valor */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs px-2 py-1 rounded-lg bg-[#F5F2FF] dark:bg-[#2A2538] text-gray-700 dark:text-gray-100">
          {item.category?.name ?? "Categoria"}
        </div>

        <div
          className={`
            text-lg font-bold
            ${item.type === "income" ? "text-green-600" : "text-red-500"}
          `}
        >
          R$ {Number(item.value).toFixed(2)}
        </div>
      </div>

      {/* Linha de infos */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar size={12} /> {item.date || "--"}
        </div>

        {item.bank && (
          <div className="flex items-center gap-1">
            <Banknote size={12} />
            {item.bank.name}
          </div>
        )}

        <div className={status.class}>{status.label}</div>
      </div>

      {/* Ações */}
      <div className="flex justify-end gap-2 mt-4">
        {!item.paid_at && item.type === "expense" && (
          <button
            onClick={() => updateInline(item, "paid_at", getTodayIso())}
            className="
              text-xs px-3 py-1.5 rounded-xl
              bg-green-100 text-green-600
              dark:bg-[#1d3a32] dark:text-green-300
              flex items-center gap-1
            "
          >
            <CheckCircle2 size={14} /> Pagar agora
          </button>
        )}

        <button
          onClick={() => openEditItemModal(item)}
          className="
            text-xs px-3 py-1.5 rounded-xl
            bg-[#EFEAFF] text-[#7B61FF]
            dark:bg-[#2A2538] dark:text-[#CBB6FF]
          "
        >
          <Edit2 size={14} />
        </button>

        <button
          onClick={() => deleteInline(item)}
          className="
            text-xs px-3 py-1.5 rounded-xl
            bg-red-100 text-red-600
            dark:bg-[#3A1F25] dark:text-red-300
          "
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

/* Format Brazilian Date */
function formatBrDate(d: string) {
  if (!d) return "--";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}
