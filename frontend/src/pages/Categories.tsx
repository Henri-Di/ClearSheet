// src/pages/Categories.tsx
import { useEffect, useState } from "react";
import { api } from "../services/api";

import {
  FolderPlus,
  FolderTree,
  Trash2,
  Pencil,
  LayoutGrid,
  ShoppingBag,
  Home,
  Car,
  Utensils,
  PiggyBank,
  AlertCircle,
  ArrowRight,
  X,
  Loader2,
  Tag,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// =========================================================
// CONFIG: TOAST PADRÃO (PASTEL)
// =========================================================
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: "#ffffff",
  color: "#2F2F36",
  iconColor: "#7B61FF",
});

// =========================================================
// TYPES
// =========================================================

interface Category {
  id: number;
  name: string;
  icon?: string | null;
}

interface SheetSummary {
  id: number;
  name: string;
  month: number;
  year: number;
  income: number;
  expense: number;
  balance: number;
}

// =========================================================
// ICON OPTIONS
// =========================================================

const CATEGORY_ICONS = [
  { value: "folder", label: "Padrão", Icon: FolderTree },
  { value: "grid", label: "Organização", Icon: LayoutGrid },
  { value: "shopping", label: "Compras", Icon: ShoppingBag },
  { value: "home", label: "Casa", Icon: Home },
  { value: "car", label: "Transporte", Icon: Car },
  { value: "food", label: "Alimentação", Icon: Utensils },
  { value: "savings", label: "Poupança", Icon: PiggyBank },
];

function getCategoryIcon(icon?: string | null) {
  return CATEGORY_ICONS.find((i) => i.value === icon) ?? CATEGORY_ICONS[0];
}

// =========================================================
// HELPERS
// =========================================================
function extractArray(data: any) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// =========================================================
// PAGE
// =========================================================

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [sheets, setSheets] = useState<SheetSummary[]>([]);
  const [loadingSheets, setLoadingSheets] = useState(false);

  const navigate = useNavigate();

  // MODALS
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newCategory, setNewCategory] = useState({
    name: "",
    icon: "folder",
  });

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    icon: "folder",
  });

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  // =========================================================
  // LOAD CATEGORIES
  // =========================================================

  async function loadCategories() {
    try {
      setLoadingCategories(true);

      const res = await api.get("/categories");
      const raw = extractArray(res.data);

      setCategories(
        raw.map((c: any) => ({
          id: c.id,
          name: c.name,
          icon: c.icon ?? null,
        }))
      );
    } catch {
      Toast.fire({ icon: "error", title: "Falha ao carregar categorias." });
    } finally {
      setLoadingCategories(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  // =========================================================
  // LOAD SHEETS OF CATEGORY
  // =========================================================

  async function loadSheetsForCategory(category: Category) {
    try {
      setSelectedCategory(category);
      setLoadingSheets(true);
      setSheets([]);

      const res = await api.get(`/categories/${category.id}/sheets`);
      const raw = extractArray(res.data);

      setSheets(
        raw.map((s: any) => ({
          id: s.id,
          name: s.name,
          month: Number(s.month),
          year: Number(s.year),
          income: Number(s.income),
          expense: Number(s.expense),
          balance: Number(s.balance),
        }))
      );
    } catch {
      Toast.fire({ icon: "error", title: "Falha ao carregar planilhas." });
    } finally {
      setLoadingSheets(false);
    }
  }

  // =========================================================
  // CREATE CATEGORY
  // =========================================================

  async function createCategory() {
    if (!newCategory.name.trim()) {
      Toast.fire({ icon: "warning", title: "Informe o nome da categoria." });
      return;
    }

    try {
      const payload = {
        name: newCategory.name.trim(),
        icon: newCategory.icon,
      };

      const res = await api.post("/categories", payload);
      const data = res.data?.data ?? res.data;

      setCategories((prev) => [
        {
          id: data.id,
          name: data.name,
          icon: data.icon,
        },
        ...prev,
      ]);

      setShowCreateModal(false);

      Toast.fire({ icon: "success", title: "Categoria criada!" });
    } catch (err: any) {
      Toast.fire({
        icon: "error",
        title: err?.response?.data?.message || "Erro ao criar categoria.",
      });
    }
  }

  // =========================================================
  // EDIT CATEGORY
  // =========================================================

  function openEditModal(category: Category) {
    setEditingCategory(category);
    setEditForm({
      name: category.name,
      icon: category.icon || "folder",
    });
    setShowEditModal(true);
  }

  async function updateCategory() {
    if (!editingCategory) return;

    if (!editForm.name.trim()) {
      Toast.fire({ icon: "warning", title: "Informe o nome da categoria." });
      return;
    }

    try {
      const payload = {
        name: editForm.name.trim(),
        icon: editForm.icon,
      };

      const res = await api.put(
        `/categories/${editingCategory.id}`,
        payload
      );
      const data = res.data?.data ?? res.data;

      const updated: Category = {
        id: data.id,
        name: data.name,
        icon: data.icon,
      };

      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );

      if (selectedCategory?.id === updated.id) {
        setSelectedCategory(updated);
      }

      setShowEditModal(false);

      Toast.fire({ icon: "success", title: "Categoria atualizada!" });
    } catch {
      Toast.fire({
        icon: "error",
        title: "Erro ao atualizar categoria.",
      });
    }
  }

  // =========================================================
  // DELETE CATEGORY
  // =========================================================

  async function deleteCategory(id: number) {
    const confirm = await Swal.fire({
      title: "Excluir categoria?",
      text: "Esta ação não poderá ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Excluir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));

      if (selectedCategory?.id === id) {
        setSelectedCategory(null);
        setSheets([]);
      }

      Toast.fire({ icon: "success", title: "Categoria excluída!" });
    } catch {
      Toast.fire({ icon: "error", title: "Erro ao excluir." });
    }
  }

  // =========================================================
  // SKELETONS
  // =========================================================

  const SkeletonCategory = () => (
    <div className="animate-pulse flex items-center justify-between border-t border-[#F1EEF9] px-4 py-3">
      <div className="h-4 w-32 bg-[#EEE9FA] rounded-xl" />
      <div className="h-4 w-20 bg-[#EEE9FA] rounded-xl" />
    </div>
  );

  const SkeletonSheet = () => (
    <tr className="animate-pulse border-t border-[#F1EEF9]">
      <td className="p-3">
        <div className="h-4 w-32 bg-[#EEE9FA] rounded-xl" />
      </td>
      <td className="p-3">
        <div className="h-4 w-16 bg-[#EEE9FA] rounded-xl" />
      </td>
      <td className="p-3 text-right">
        <div className="h-4 w-16 bg-[#EEE9FA] rounded-xl ml-auto" />
      </td>
      <td className="p-3 text-right">
        <div className="h-4 w-16 bg-[#EEE9FA] rounded-xl ml-auto" />
      </td>
      <td className="p-3 text-right">
        <div className="h-4 w-16 bg-[#EEE9FA] rounded-xl ml-auto" />
      </td>
      <td className="p-3 text-right">
        <div className="h-4 w-10 bg-[#EEE9FA] rounded-xl ml-auto" />
      </td>
    </tr>
  );

  // =========================================================
  // VIEW
  // =========================================================

  return (
    <div className="animate-fadeIn space-y-10 pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-[#2F2F36] tracking-tight">
          Categorias
        </h1>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#7B61FF] text-white px-5 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-[#6A54E6] transition"
        >
          <FolderPlus size={18} /> Nova Categoria
        </button>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* CATEGORIES TABLE */}
        <div className="bg-white border rounded-3xl shadow-sm border-[#E4E2F0]">
          <div className="px-6 py-5 border-b border-[#F2EEF9]">
            <h2 className="text-lg font-semibold text-[#2F2F36]">
              Categorias
            </h2>
          </div>

          {loadingCategories ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCategory key={i} />
              ))}
            </>
          ) : (
            <table className="w-full">
              <thead className="bg-[#F6F4FF] text-[#4B4A54]">
                <tr>
                  <th className="p-4 text-left">Nome</th>
                  <th className="p-4 text-left">Ícone</th>
                  <th className="p-4 text-right pr-6">Ações</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => {
                  const iconInfo = getCategoryIcon(category.icon);
                  const isSelected = selectedCategory?.id === category.id;

                  return (
                    <tr
                      key={category.id}
                      className={`border-t border-[#F1EEF9] hover:bg-[#FAF8FF] cursor-pointer ${
                        isSelected ? "bg-[#F3ECFF]" : ""
                      }`}
                      onClick={() => loadSheetsForCategory(category)}
                    >
                      <td className="p-4">
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-2xl bg-white border border-[#EEEAFB] shadow-sm flex items-center justify-center">
                            <iconInfo.Icon
                              size={18}
                              className="text-[#7B61FF]"
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {iconInfo.label}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 pr-6">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(category);
                            }}
                            className="text-xs text-[#7B61FF] hover:underline flex items-center gap-1"
                          >
                            <Pencil size={14} /> Editar
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCategory(category.id);
                            }}
                            className="text-xs text-red-600 hover:underline flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* SHEETS TABLE */}
        <div className="bg-white border rounded-3xl shadow-sm border-[#E4E2F0]">
          <div className="px-6 py-5 border-b border-[#F2EEF9]">
            <h2 className="text-lg font-semibold text-[#2F2F36]">
              Planilhas vinculadas
            </h2>
          </div>

          {!selectedCategory ? (
            <p className="p-6 text-gray-500 text-sm">
              Selecione uma categoria para visualizar as planilhas.
            </p>
          ) : loadingSheets ? (
            <table className="w-full">
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonSheet key={i} />
                ))}
              </tbody>
            </table>
          ) : sheets.length === 0 ? (
            <p className="p-6 text-sm text-gray-500 flex items-center gap-2">
              <AlertCircle size={16} className="text-[#7B61FF]" /> Nenhuma
              planilha vinculada.
            </p>
          ) : (
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-sm">
                <thead className="bg-[#F6F4FF] text-[#4B4A54]">
                  <tr>
                    <th className="p-3 text-left">Planilha</th>
                    <th className="p-3 text-left">Mês/Ano</th>
                    <th className="p-3 text-right">Entradas</th>
                    <th className="p-3 text-right">Saídas</th>
                    <th className="p-3 text-right">Saldo Final</th>
                    <th className="p-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sheets.map((sheet) => (
                    <tr
                      key={sheet.id}
                      className="border-t border-[#F1EEF9] hover:bg-[#FAF8FF] transition"
                    >
                      <td className="p-3">{sheet.name}</td>
                      <td className="p-3">
                        {String(sheet.month).padStart(2, "0")}/{sheet.year}
                      </td>

                      <td className="p-3 text-right text-green-600">
                        {formatCurrency(sheet.income)}
                      </td>
                      <td className="p-3 text-right text-red-600">
                        {formatCurrency(sheet.expense)}
                      </td>
                      <td
                        className={`p-3 text-right font-semibold ${
                          sheet.balance >= 0
                            ? "text-[#2F4A8A]"
                            : "text-red-600"
                        }`}
                      >
                        {formatCurrency(sheet.balance)}
                      </td>

                      <td className="p-3 text-right">
                        <button
                          className="text-xs text-[#7B61FF] hover:underline flex items-center gap-1 ml-auto"
                          onClick={() => navigate(`/sheets/${sheet.id}`)}
                        >
                          Abrir <ArrowRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
         CREATE CATEGORY MODAL
      ======================================================== */}
      {showCreateModal && (
        <ModalWrapper>
          <ModalCard
            title="Nova Categoria"
            icon={<Tag size={20} className="text-[#7B61FF]" />}
            onClose={() => setShowCreateModal(false)}
            actionLabel="Criar categoria"
            onAction={createCategory}
          >
            <InputField
              label="Nome"
              icon={<Tag className="text-gray-400" size={16} />}
              value={newCategory.name}
              onChange={(v: any) =>
                setNewCategory((f) => ({ ...f, name: v }))
              }
            />

            <SelectField
              label="Ícone"
              value={newCategory.icon}
              onChange={(v: any) =>
                setNewCategory((f) => ({ ...f, icon: v }))
              }
            />
          </ModalCard>
        </ModalWrapper>
      )}

      {/* ========================================================
         EDIT CATEGORY MODAL
      ======================================================== */}
      {showEditModal && editingCategory && (
        <ModalWrapper>
          <ModalCard
            title="Editar Categoria"
            icon={<Tag size={20} className="text-[#7B61FF]" />}
            onClose={() => setShowEditModal(false)}
            actionLabel="Salvar alterações"
            onAction={updateCategory}
          >
            <InputField
              label="Nome"
              icon={<Tag className="text-gray-400" size={16} />}
              value={editForm.name}
              onChange={(v: any) =>
                setEditForm((f) => ({ ...f, name: v }))
              }
            />

            <SelectField
              label="Ícone"
              value={editForm.icon}
              onChange={(v: any) =>
                setEditForm((f) => ({ ...f, icon: v }))
              }
            />
          </ModalCard>
        </ModalWrapper>
      )}
    </div>
  );
}

// =========================================================
// REUSABLE MODAL COMPONENTS (PADRÃO CreateSheetModal)
// =========================================================

function ModalWrapper({ children }: { children: any }) {
  return (
    <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-50">
      {children}
    </div>
  );
}

function ModalCard({
  title,
  icon,
  children,
  onClose,
  onAction,
  actionLabel,
}: any) {
  const [loading, setLoading] = useState(false);

  async function handleAction() {
    if (loading) return;
    setLoading(true);
    await onAction();
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-3xl w-[95%] max-w-lg p-6 shadow-lg border border-[#E6E1F7] animate-fadeIn">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#F3F0FF] border border-[#E0DCFF]">
            {icon}
          </div>
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        <button
          onClick={onClose}
          className="text-gray-600 hover:text-black"
          disabled={loading}
        >
          <X size={22} />
        </button>
      </div>

      {/* CONTENT */}
      <div className="space-y-4">{children}</div>

      {/* ACTION */}
      <button
        onClick={handleAction}
        disabled={loading}
        className={`rounded-xl px-5 py-3 w-full mt-6 font-medium flex items-center justify-center gap-2 ${
          loading
            ? "bg-[#7B61FF]/70 cursor-not-allowed"
            : "bg-[#7B61FF] hover:bg-[#6A54E6]"
        } text-white transition`}
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        {loading ? "Aguarde..." : actionLabel}
      </button>
    </div>
  );
}

// =========================================================
// FORM FIELDS
// =========================================================

function InputField({ label, icon, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>

      <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
        {icon}
        <input
          className="w-full bg-transparent outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>

      <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-[#FBFAFF]">
        <select
          className="bg-transparent outline-none flex-1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {CATEGORY_ICONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
