import { useSheetView } from "../hooks/useSheetView";

import { Header } from "../components/Header";
import { SheetCard } from "../components/SheetCard";
import ItemsList from "../components/ItemList"; 
import { ItemModal } from "../components/ItemModal";
import { EditSheetModal } from "../components/EditSheetModal";

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


  return (
    <div className="space-y-6">

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

      {sheet && (
        <SheetCard
          sheet={sheet}
          entradas={entradas}
          saidas={saidas}
          items={filtered ?? []} 
        />
      )}

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
