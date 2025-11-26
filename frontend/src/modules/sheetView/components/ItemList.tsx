import { ItemRow } from "./ItemRow";
import EmptyState from "./EmptyState";

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
        "
      >

        <div
          className="
            absolute inset-0 z-10 pointer-events-none
            bg-gradient-to-r from-transparent via-[#EDE7FF]/50 to-transparent
            animate-shimmer
            dark:hidden
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

          <thead className="border-b border-[#E6E1F7] bg-[#F7F5FF] dark:hidden">
            <tr>
              {[
                "w-10",
                "w-[34%]",
                "w-[20%]",
                "w-[12%]",
                "w-[18%]",
                "w-[10%]",
                "w-[16%]",
                "w-32",
              ].map((w, i) => (
                <th key={i} className="py-4 px-3 text-center">
                  <div className={`h-4 rounded bg-[#E7E2FF] ${w} mx-auto`} />
                </th>
              ))}
            </tr>
          </thead>

          <thead className="hidden dark:table-header-group border-b border-[#1F1C2A] bg-[#14121E]">
            <tr>
              {[
                "w-10",
                "w-[34%]",
                "w-[20%]",
                "w-[12%]",
                "w-[18%]",
                "w-[10%]",
                "w-[16%]",
                "w-32",
              ].map((w, i) => (
                <th key={i} className="py-4 px-3">
                  <div className={`h-4 rounded bg-[#2A2638] ${w} mx-auto`} />
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="dark:hidden">
            {[...Array(8)].map((_, i) => (
              <tr key={i} className="border-b border-[#F0ECFF]">
                <td className="py-6 px-4 text-center">
                  <div className="h-4 w-4 rounded bg-[#E6E1F7] mx-auto" />
                </td>

                <td className="py-6 px-4">
                  <div className="flex flex-col gap-3">
                    <div className="h-4 w-24 rounded-full bg-[#DED7FF]" />
                    <div className="h-10 w-full rounded-2xl bg-[#EDEAFF]" />
                  </div>
                </td>

                <td className="py-6 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#EAE6FF]" />
                    <div className="h-6 w-32 rounded bg-[#DED9F8]" />
                  </div>
                </td>

                <td className="py-6 px-4 text-center">
                  <div className="h-10 w-24 rounded-2xl bg-[#EDEAFF] mx-auto" />
                </td>

                <td className="py-6 px-4 text-center">
                  <div className="h-10 w-32 rounded-2xl bg-[#EFEAFF] mx-auto" />
                </td>

                <td className="py-6 px-4 text-center">
                  <div className="h-6 w-20 rounded bg-[#E6E1F7] mx-auto" />
                </td>

                <td className="py-6 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E8E3FF]" />
                    <div className="h-10 w-full rounded-2xl bg-[#F1ECFF]" />
                  </div>
                </td>

                <td className="py-6 px-4">
                  <div className="flex justify-end gap-3">
                    <div className="h-6 w-10 rounded bg-[#E6E1F7]" />
                    <div className="h-6 w-12 rounded bg-[#E3DFFF]" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

          <tbody className="hidden dark:table-row-group">
            {[...Array(8)].map((_, i) => (
              <tr key={i} className="border-b border-[#1B1824]">
                <td className="py-6 px-4 text-center">
                  <div className="h-4 w-4 rounded bg-[#2A2638] mx-auto" />
                </td>

                <td className="py-6 px-4">
                  <div className="flex flex-col gap-3">
                    <div className="h-4 w-20 rounded-full bg-[#2D293C]" />
                    <div className="h-10 w-full rounded-2xl bg-[#231F2E]" />
                  </div>
                </td>

                <td className="py-6 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2A2638]" />
                    <div className="h-6 w-32 rounded bg-[#2D293C]" />
                  </div>
                </td>

                <td className="py-6 px-4 text-center">
                  <div className="h-10 w-24 rounded-2xl bg-[#231F2E] mx-auto" />
                </td>

                <td className="py-6 px-4 text-center">
                  <div className="h-10 w-32 rounded-2xl bg-[#231F2E] mx-auto" />
                </td>

                <td className="py-6 px-4 text-center">
                  <div className="h-6 w-20 rounded bg-[#2A2638] mx-auto" />
                </td>

                <td className="py-6 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2A2638]" />
                    <div className="h-10 w-full rounded-2xl bg-[#231F2E]" />
                  </div>
                </td>

                <td className="py-6 px-4">
                  <div className="flex justify-end gap-3">
                    <div className="h-6 w-10 rounded bg-[#2A2638]" />
                    <div className="h-6 w-12 rounded bg-[#2D293C]" />
                  </div>
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


  return (
    <div
      className="
        rounded-3xl overflow-x-auto
        bg-white border border-[#E6E1F7] shadow
        dark:bg-[#13111B] dark:border-[#1F1C2A] dark:shadow-xl
      "
    >
      <table className="w-full min-w-[1400px] bg-white dark:bg-[#13111B]">


        <thead className="bg-[#F5F2FF] border-b border-[#E6E1F7] dark:hidden">
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


        <thead className="hidden dark:table-header-group bg-[#14121E] border-b border-[#1F1C2A]">
          <tr className="text-[#8F8BA0] text-[12px] font-semibold uppercase tracking-wide">
            <th className="py-4 px-3 w-10 text-center">#</th>
            <th className="py-4 px-3 w-[34%] text-left">Descrição</th>
            <th className="py-4 px-3 w-[20%] text-left">Categoria</th>
            <th className="py-4 px-3 w-[12%] text-left">Valor</th>
            <th className="py-4 px-3 w-[18%] text-left">Data</th>
            <th className="py-4 px-3 w-[10%] text-left">Status</th>
            <th className="py-4 px-3 w-[16%] text-left">Banco</th>
            <th className="py-4 px-3 w-32 text-right pr-6">Ações</th>
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
  );
}
