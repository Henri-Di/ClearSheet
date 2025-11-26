import { useEffect, useMemo, useState } from "react";
import { api } from "../../../services/api";
import Swal from "sweetalert2";

import type { Category, SheetSummary } from "../types/category";
import { extractArray } from "../utils/extractArray";
import { formatCurrency } from "../utils/format";

// Helpers de SweetAlert2 normal (sem toast)
function alertSuccess(msg: string) {
  return Swal.fire({
    icon: "success",
    title: msg,
    confirmButtonText: "OK",
    customClass: {
      popup: "rounded-3xl",
      confirmButton:
        "bg-[#7B61FF] text-white rounded-xl px-4 py-2 font-medium shadow",
    },
  });
}

function alertError(msg: string) {
  return Swal.fire({
    icon: "error",
    title: "Erro",
    text: msg,
    customClass: {
      popup: "rounded-3xl",
      confirmButton:
        "bg-red-500 text-white rounded-xl px-4 py-2 font-medium shadow",
    },
  });
}

function alertWarning(msg: string) {
  return Swal.fire({
    icon: "warning",
    title: "Atenção",
    text: msg,
    customClass: {
      popup: "rounded-3xl",
      confirmButton:
        "bg-yellow-400 text-white rounded-xl px-4 py-2 font-medium shadow",
    },
  });
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [sheets, setSheets] = useState<SheetSummary[]>([]);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSheets, setLoadingSheets] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const [newCategory, setNewCategory] = useState({
    name: "",
    icon: "folder",
  });

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [editForm, setEditForm] = useState({
    name: "",
    icon: "folder",
  });

  const [filterSearch, setFilterSearch] = useState<string>("");
  const [filterIcon, setFilterIcon] = useState<string>("");
  const [filterSort, setFilterSort] = useState<"asc" | "desc" | "none">("none");

  const filteredCategories = useMemo(() => {
    return categories
      .filter((c) =>
        c.name.toLowerCase().includes(filterSearch.toLowerCase())
      )
      .filter((c) => (filterIcon ? c.icon === filterIcon : true))
      .sort((a, b) => {
        if (filterSort === "asc") return a.name.localeCompare(b.name);
        if (filterSort === "desc") return b.name.localeCompare(a.name) * -1;
        return 0;
      });
  }, [categories, filterSearch, filterIcon, filterSort]);

  const [sheetSearch, setSheetSearch] = useState<string>("");
  const [sheetMonth, setSheetMonth] = useState<string>("");
  const [sheetYear, setSheetYear] = useState<string>("");

  const filteredSheets = useMemo(() => {
    return sheets
      .filter((s) =>
        s.name.toLowerCase().includes(sheetSearch.toLowerCase())
      )
      .filter((s) => (sheetMonth ? s.month === Number(sheetMonth) : true))
      .filter((s) => (sheetYear ? s.year === Number(sheetYear) : true));
  }, [sheets, sheetSearch, sheetMonth, sheetYear]);

  async function loadCategories() {
    try {
      setLoadingCategories(true);

      const res = await api.get("/categories");
      const raw = extractArray(res.data);

      setCategories(
        raw.map((c: any) => ({
          id: c.id,
          name: c.name,
          icon: c.icon && c.icon.trim() !== "" ? c.icon : "folder",
        }))
      );
    } catch {
      alertError("Falha ao carregar categorias.");
    } finally {
      setLoadingCategories(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

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
      alertError("Falha ao carregar planilhas.");
    } finally {
      setLoadingSheets(false);
    }
  }

  async function createCategory() {
    const name = newCategory.name.trim();

    if (!name) {
      alertWarning("Informe o nome da categoria.");
      return;
    }

    try {
      setActionLoading(true);

      const payload = { name, icon: newCategory.icon };
      const res = await api.post("/categories", payload);
      const data = res.data?.data ?? res.data;

      setCategories((prev) => [
        { id: data.id, name: data.name, icon: data.icon },
        ...prev,
      ]);

      setShowCreateModal(false);
      alertSuccess("Categoria criada com sucesso!");

    } catch {
      alertError("Falha ao criar categoria.");
    } finally {
      setActionLoading(false);
    }
  }

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

    const name = editForm.name.trim();

    if (!name) {
      alertWarning("Informe o nome da categoria.");
      return;
    }

    try {
      setActionLoading(true);

      const payload = {
        name,
        icon: editForm.icon,
      };

      const res = await api.put(`/categories/${editingCategory.id}`, payload);
      const data = res.data?.data ?? res.data;

      const updated = {
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
      alertSuccess("Categoria atualizada!");

    } catch {
      alertError("Falha ao atualizar categoria.");
    } finally {
      setActionLoading(false);
    }
  }

  async function deleteCategory(id: number) {
    const confirm = await Swal.fire({
      title: "Excluir categoria?",
      text: "Esta ação não poderá ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Excluir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#E02424",
      customClass: {
        popup: "rounded-3xl",
        confirmButton:
          "bg-red-500 text-white rounded-xl px-4 py-2 text-sm font-medium",
        cancelButton:
          "bg-gray-100 text-gray-700 rounded-xl px-4 py-2 text-sm font-medium",
      },
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/categories/${id}`);

      setCategories((prev) => prev.filter((c) => c.id !== id));

      if (selectedCategory?.id === id) {
        setSelectedCategory(null);
        setSheets([]);
      }

      alertSuccess("Categoria excluída!");

    } catch {
      alertError("Falha ao excluir categoria.");
    }
  }

  return {
    categories,
    filteredCategories,
    sheets,
    filteredSheets,
    loadingCategories,
    loadingSheets,
    selectedCategory,
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    newCategory,
    setNewCategory,
    editingCategory,
    setEditingCategory,
    editForm,
    setEditForm,
    loadSheetsForCategory,
    createCategory,
    openEditModal,
    updateCategory,
    deleteCategory,
    actionLoading,
    filterSearch,
    setFilterSearch,
    filterIcon,
    setFilterIcon,
    filterSort,
    setFilterSort,
    sheetSearch,
    setSheetSearch,
    sheetMonth,
    setSheetMonth,
    sheetYear,
    setSheetYear,
    formatCurrency,
  };
}
