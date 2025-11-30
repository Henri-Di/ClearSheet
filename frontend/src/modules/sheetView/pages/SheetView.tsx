import { useSheetView } from "../hooks/useSheetView";

import { Header } from "../components/Header";
import { SheetCard } from "../components/SheetCard";
import ItemsList from "../components/ItemList";
import { ItemModal } from "../components/ItemModal";
import { EditSheetModal } from "../components/EditSheetModal";

import { RefreshCcw } from "lucide-react";
import { useState } from "react";

export default function SheetViewPage() {
  const {
    sheet,
    banks,
    categories,

    loading,

    search,
    setSearch,
    sortField,
    setSortField,
    direction,
    setDirection,
    sortMenuOpen,
    setSortMenuOpen,

    filtered,
    entradas,
    saidas,

    lastUpdatedKey,
    updatingInlineKey,

    updateLocalItemField,
    updateInline,
    deleteInline,
    openEditItemModal,

    showItemModal,
    setShowItemModal,
    showSheetModal,
    setShowSheetModal,

    itemForm,
    setItemForm,
    sheetForm,
    setSheetForm,
    modalMode,
    savingItem,
    savingSheet,

    openCreateItemModal,
    openEditSheetModal,

    saveItemFromModal,
    saveSheet,
    deleteSheet,

    getTodayIso,

    reload,
  } = useSheetView();

  if (!loading && !sheet) {
    return (
      <div className="rounded-3xl bg-white border border-[#E6E1F7] shadow p-10 text-center">
        <div className="text-lg font-semibold text-gray-700">
          Planilha não encontrada.
        </div>
      </div>
    );
  }

  const [isReloading, setIsReloading] = useState(false);

  return (
    <div
      className="
        w-full
        px-4 sm:px-6 lg:px-10
        max-w-7xl
        mx-auto
        space-y-6
        overflow-x-hidden
      "
    >
      {/* HEADER PRINCIPAL */}
      {sheet && (
        <Header
          sheet={sheet}
          search={search}
          setSearch={setSearch}
          sortMenuOpen={sortMenuOpen}
          setSortMenuOpen={setSortMenuOpen}
          direction={direction}
          sortField={sortField}
          setSortField={setSortField}
          setDirection={setDirection}
          deletingSheet={false}
          deleteSheet={deleteSheet}
          openEditSheetModal={openEditSheetModal}
          openCreateItemModal={openCreateItemModal}
        />
      )}

      {/* STICKY REFRESH BAR (ELEGANTE ENTERPRISE) */}
      <div className="
        sticky top-0 z-50
        bg-white/70 dark:bg-[#0f0f15]/70
        backdrop-blur-lg
        border-b border-[#E6E1F7] dark:border-[#1F1C2A]
        py-2 flex justify-center
      ">
        <button
          onClick={() => {
            reload();
            setIsReloading(true);
            setTimeout(() => setIsReloading(false), 1000);
          }}
          className="
            px-4 py-2 rounded-xl
            bg-[#7B61FF] text-white shadow-md
            hover:bg-[#6a50f3] transition-all
            flex items-center gap-2 text-sm font-semibold
          "
        >
          <RefreshCcw
            size={16}
            className={isReloading ? "animate-spin-ease" : ""}
          />
          Atualizar dados
        </button>
      </div>

      {/* CARD PRINCIPAL */}
      {sheet && (
        <SheetCard
          sheet={sheet}
          entradas={entradas}
          saidas={saidas}
          items={filtered ?? []}
        />
      )}

      {/* LISTA DE ITEMS */}
      <ItemsList
        items={filtered ?? []}
        loading={loading}
        banks={banks ?? []}
        categories={categories ?? []}
        lastUpdatedKey={lastUpdatedKey}
        updatingInlineKey={updatingInlineKey}
        updateLocalItemField={updateLocalItemField}
        updateInline={updateInline}
        deleteInline={deleteInline}
        openEditItemModal={openEditItemModal}
        getTodayIso={getTodayIso}
      />

      {showItemModal && (
        <ItemModal
          mode={modalMode}
          form={itemForm}
          setForm={setItemForm}
          categories={categories ?? []}
          banks={banks ?? []}
          saving={savingItem}
          onSave={saveItemFromModal}
          onClose={() => setShowItemModal(false)}
        />
      )}

      {showSheetModal && (
        <EditSheetModal
          form={sheetForm}
          setForm={setSheetForm}
          saving={savingSheet}
          onSave={saveSheet}
          onClose={() => setShowSheetModal(false)}
        />
      )}
    </div>
  );
}
