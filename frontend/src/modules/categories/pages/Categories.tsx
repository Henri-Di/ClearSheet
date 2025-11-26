
import { FolderPlus, Tag } from "lucide-react";

import { useCategories } from "../hooks/useCategories";

import { CategoryList } from "../components/CategoryList";
import { LinkedSheetsTable } from "../components/LinkedSheetsTable";
import { CategoryModal } from "../components/CategoryModal";

import { InputField } from "../components/InputField";
import { SelectField } from "../components/SelectField";

import { CATEGORY_ICONS } from "../utils/categoryIcons";

import { CategoryFiltersBar } from "../components/CategoryFiltersBar";
import { LinkedSheetsFiltersBar } from "../components/LinkedSheetsFiltersBar";

export default function CategoriesPage() {
  const c = useCategories();

  return (
    <div
      className="
        animate-fadeIn space-y-10 pb-20
        text-primary-text dark:text-gray-200
        transition-colors
      "
    >

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1
          className="
            font-display text-3xl font-semibold tracking-tight
            text-primary-text dark:text-white transition-colors
          "
        >
          Categorias
        </h1>

        <button
          onClick={() => c.setShowCreateModal(true)}
          className="
            bg-[#7B61FF] dark:bg-[#6A54E6]
            text-white px-5 py-3 rounded-xl font-medium 
            flex items-center gap-2 
            hover:bg-[#6A54E6] dark:hover:bg-[#5b49c7]
            transition-colors
          "
        >
          <FolderPlus size={18} /> Nova Categoria
        </button>
      </div>

      {/* CARD — LISTA DE CATEGORIAS */}
      <div
        className="
          bg-white dark:bg-dark-card
          border border-[#E4E2F0] dark:border-dark-border
          rounded-3xl shadow-sm 
          transition-colors
        "
      >
        <div
          className="
            px-6 py-5 border-b
            border-[#F2EEF9] dark:border-[#2A2736]
            space-y-4 
            transition-colors
          "
        >
          <h2 className="text-lg font-semibold text-primary-text dark:text-white transition-colors">
            Categorias
          </h2>

          <CategoryFiltersBar
            search={c.filterSearch}
            setSearch={c.setFilterSearch}
            iconFilter={c.filterIcon}
            setIconFilter={c.setFilterIcon}
            sort={c.filterSort}
            setSort={c.setFilterSort}
          />
        </div>

        <CategoryList
          categories={c.filteredCategories}
          loading={c.loadingCategories}
          selectedCategoryId={c.selectedCategory?.id ?? null}
          onSelect={c.loadSheetsForCategory}
          onEdit={c.openEditModal}
          onDelete={c.deleteCategory}
        />
      </div>

      {/* CARD — PLANILHAS VINCULADAS */}
      <div
        className="
          bg-white dark:bg-dark-card
          border border-[#E4E2F0] dark:border-dark-border
          rounded-3xl shadow-sm 
          transition-colors
        "
      >
        <div
          className="
            px-6 py-5 border-b
            border-[#F2EEF9] dark:border-[#2A2736]
            space-y-4
            transition-colors
          "
        >
          <h2 className="text-lg font-semibold text-primary-text dark:text-white transition-colors">
            Planilhas vinculadas
          </h2>

          {c.selectedCategory && (
            <LinkedSheetsFiltersBar
              search={c.sheetSearch}
              setSearch={c.setSheetSearch}
              month={c.sheetMonth}
              setMonth={c.setSheetMonth}
              year={c.sheetYear}
              setYear={c.setSheetYear}
            />
          )}
        </div>

        {!c.selectedCategory ? (
          <p className="p-6 text-gray-500 dark:text-gray-400 text-sm">
            Selecione uma categoria para visualizar as planilhas.
          </p>
        ) : (
          <LinkedSheetsTable
            loading={c.loadingSheets}
            sheets={c.filteredSheets}
          />
        )}
      </div>

      {/* MODAIS */}
      {c.showCreateModal && (
        <CategoryModal
          title="Nova Categoria"
          icon={<Tag size={20} className="text-[#7B61FF]" />}
          onClose={() => c.setShowCreateModal(false)}
          onAction={c.createCategory}
          actionLabel="Criar categoria"
          loading={c.actionLoading}
        >
          <InputField
            label="Nome"
            icon={<Tag className="text-gray-400" size={16} />}
            value={c.newCategory.name}
            onChange={(v) =>
              c.setNewCategory((prev) => ({ ...prev, name: v }))
            }
          />

          <SelectField
            label="Ícone"
            value={c.newCategory.icon}
            onChange={(v) =>
              c.setNewCategory((prev) => ({ ...prev, icon: v }))
            }
            options={CATEGORY_ICONS}
          />
        </CategoryModal>
      )}

      {c.showEditModal && (
        <CategoryModal
          title="Editar Categoria"
          icon={<Tag size={20} className="text-[#7B61FF]" />}
          onClose={() => c.setShowEditModal(false)}
          onAction={c.updateCategory}
          actionLabel="Salvar alterações"
          loading={c.actionLoading}
        >
          <InputField
            label="Nome"
            icon={<Tag className="text-gray-400" size={16} />}
            value={c.editForm.name}
            onChange={(v) =>
              c.setEditForm((prev) => ({ ...prev, name: v }))
            }
          />

          <SelectField
            label="Ícone"
            value={c.editForm.icon}
            onChange={(v) =>
              c.setEditForm((prev) => ({ ...prev, icon: v }))
            }
            options={CATEGORY_ICONS}
          />
        </CategoryModal>
      )}
    </div>
  );
}
