import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Coins,
  Search,
  SortAsc,
  SortDesc,
  X,
  Calendar,
  Tag,
  DollarSign,
  Link as LinkIcon,
  Pencil,
  ChevronDown,
  Landmark,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Utensils,
  Car,
  Home,
  ShoppingCart,
  HeartPulse,
  GraduationCap,
  PiggyBank,
  PawPrint,
  ReceiptText,
  Wrench,
  Briefcase,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

/* ============================================================================
 * Domain types
 * ==========================================================================*/
interface Sheet {
  id: number;
  name: string;
  description: string | null;
  month: number;
  year: number;
  initial_balance: number;
}

interface Category {
  id: number;
  name: string;
}

interface Bank {
  id: number;
  name: string;
}

type ItemType = "income" | "expense";
type SortField = "date" | "value" | "category" | "type" | "origin" | "bank";
type SortDirection = "asc" | "desc";

interface UnifiedItem {
  id: number;
  value: number;
  type: ItemType;
  description: string | null;
  date: string | null;
  paid_at: string | null;
  category: Category | null;
  category_id?: number | null;
  bank: Bank | null;
  bank_id?: number | null;
  origin: "sheet" | "transaction";
  raw: any;
}

interface ItemFormState {
  type: ItemType;
  value: string;
  category_id: string;
  bank_id: string;
  description: string;
  date: string;
  paid_at: string;
}

const EMPTY_FORM: ItemFormState = {
  type: "income",
  value: "",
  category_id: "",
  bank_id: "",
  description: "",
  date: "",
  paid_at: "",
};

/* ============================================================================
 * Toasts
 * ==========================================================================*/
const baseToast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
  customClass: {
    popup: "rounded-2xl shadow-md text-sm bg-white/95 border border-[#E6E1F7]",
    title: "font-semibold text-gray-800",
    htmlContainer: "text-xs text-gray-600",
    icon: "scale-90",
  },
});

function showSuccessToast(title: string, text?: string) {
  baseToast.fire({ icon: "success", title, text });
}
function showErrorToast(title: string, text?: string) {
  baseToast.fire({ icon: "error", title, text });
}
function showWarningToast(title: string, text?: string) {
  baseToast.fire({ icon: "warning", title, text });
}

/* ============================================================================
 * Helpers
 * ==========================================================================*/
function normalize(str: string) {
  return str
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizeIsoDate(input: string | null): string | null {
  if (!input) return null;

  if (/^\d{4}-\d{2}-\d{2}/.test(input)) {
    return input.slice(0, 10);
  }

  const d = new Date(input);
  if (isNaN(d.getTime())) return null;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateToText(date: string | null) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR");
}

function getTodayIso() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/* ============================================================================
 * Business rules
 * ==========================================================================*/
function isOverdue(item: UnifiedItem) {
  if (!item.date) return false;
  if (item.type !== "expense") return false;
  if (item.paid_at) return false;

  const today = new Date();
  const d = new Date(item.date);

  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return d < todayOnly;
}

function formatCurrency(value: number) {
  if (isNaN(value)) return "R$ 0,00";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

function getCategoryIconComponent(name: string | null | undefined): LucideIcon {
  const n = normalize(name || "");
  if (!n) return Tag;

  if (
    n.includes("aliment") ||
    n.includes("comida") ||
    n.includes("refeicao") ||
    n.includes("refeição") ||
    n.includes("restaurante") ||
    n.includes("mercado")
  ) {
    return Utensils;
  }

  if (
    n.includes("transporte") ||
    n.includes("uber") ||
    n.includes("gasolina") ||
    n.includes("combustivel") ||
    n.includes("combustível") ||
    n.includes("carro")
  ) {
    return Car;
  }

  if (
    n.includes("casa") ||
    n.includes("moradia") ||
    n.includes("aluguel") ||
    n.includes("condominio") ||
    n.includes("condomínio") ||
    n.includes("imovel") ||
    n.includes("imóvel")
  ) {
    return Home;
  }

  if (
    n.includes("salario") ||
    n.includes("salário") ||
    n.includes("renda") ||
    n.includes("ganho") ||
    n.includes("pro-labore") ||
    n.includes("pró-labore")
  ) {
    return DollarSign;
  }

  if (
    n.includes("compra") ||
    n.includes("shopping") ||
    n.includes("roupa") ||
    n.includes("loja")
  ) {
    return ShoppingCart;
  }

  if (
    n.includes("saude") ||
    n.includes("saúde") ||
    n.includes("medico") ||
    n.includes("médico") ||
    n.includes("remedio") ||
    n.includes("remédio") ||
    n.includes("hospital")
  ) {
    return HeartPulse;
  }

  if (
    n.includes("educacao") ||
    n.includes("educação") ||
    n.includes("estudo") ||
    n.includes("curso") ||
    n.includes("faculdade") ||
    n.includes("escola")
  ) {
    return GraduationCap;
  }

  if (
    n.includes("invest") ||
    n.includes("aplicacao") ||
    n.includes("aplicação") ||
    n.includes("poupanca") ||
    n.includes("poupança") ||
    n.includes("renda fixa") ||
    n.includes("bolsa")
  ) {
    return PiggyBank;
  }

  if (n.includes("pet") || n.includes("cachorro") || n.includes("gato")) {
    return PawPrint;
  }

  if (
    n.includes("imposto") ||
    n.includes("taxa") ||
    n.includes("tarifa") ||
    n.includes("tribut")
  ) {
    return ReceiptText;
  }

  if (
    n.includes("manutencao") ||
    n.includes("manutenção") ||
    n.includes("reforma") ||
    n.includes("conserto") ||
    n.includes("oficina")
  ) {
    return Wrench;
  }

  if (
    n.includes("consultoria") ||
    n.includes("servico") ||
    n.includes("serviço") ||
    n.includes("profissional")
  ) {
    return Briefcase;
  }

  return Tag;
}

/* ============================================================================
 * Main component
 * ==========================================================================*/
export default function SheetView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [sheetItems, setSheetItems] = useState<UnifiedItem[]>([]);
  const [transactionItems, setTransactionItems] = useState<UnifiedItem[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [showItemModal, setShowItemModal] = useState(false);
  const [showSheetModal, setShowSheetModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingItem, setEditingItem] = useState<UnifiedItem | null>(null);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [direction, setDirection] = useState<SortDirection>("asc");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const [itemForm, setItemForm] = useState<ItemFormState>(EMPTY_FORM);
  const [sheetForm, setSheetForm] = useState({
    name: "",
    description: "",
    month: "",
    year: "",
    initial_balance: "",
  });

  const [lastUpdatedKey, setLastUpdatedKey] = useState<string | null>(null);
  const [updatingInlineKey, setUpdatingInlineKey] = useState<string | null>(
    null
  );
  const [updatingInitialBalance, setUpdatingInitialBalance] = useState(false);
  const [deletingSheet, setDeletingSheet] = useState(false);
  const [savingSheet, setSavingSheet] = useState(false);
  const [savingItem, setSavingItem] = useState(false);
  const [paidPopoverKey, setPaidPopoverKey] = useState<string | null>(null);

  /* ------------------------------------------------------------------------
   * API → Unified
   * ----------------------------------------------------------------------*/
  function apiItemToUnified(i: any): UnifiedItem {
    return {
      id: i.id,
      value: Number(i.value),
      type: i.type === "income" || i.type === "entrada" ? "income" : "expense",
      description: i.description ?? null,
      category: i.category
        ? {
            id: i.category.id,
            name: i.category.name,
          }
        : null,
      category_id:
        i.category_id ?? (i.category ? Number(i.category.id) : null),
      bank: i.bank
        ? {
            id: i.bank.id,
            name: i.bank.name,
          }
        : null,
      bank_id: i.bank_id ?? (i.bank ? Number(i.bank.id) : null),
      date: normalizeIsoDate(i.date ?? null),
      paid_at: normalizeIsoDate(i.paid_at ?? null),
      origin: i.sheet_id ? "sheet" : "transaction",
      raw: i,
    };
  }

  /* ------------------------------------------------------------------------
   * Load data
   * ----------------------------------------------------------------------*/
  async function loadData() {
    if (!id) return;

    try {
      setLoading(true);

      const [
        sheetRes,
        sheetItemsRes,
        transactionsRes,
        banksRes,
        categoriesRes,
      ] = await Promise.all([
        api.get(`/sheets/${id}`),
        api.get(`/sheets/${id}/items`),
        api.get(`/transactions?sheet_id=${id}`),
        api.get(`/banks`),
        api.get(`/categories`),
      ]);

      const sheetData = sheetRes.data?.data ?? sheetRes.data;
      setSheet({
        ...sheetData,
        initial_balance: Number(sheetData.initial_balance),
      });

      setSheetItems(
        (sheetItemsRes.data?.data || sheetItemsRes.data || []).map(
          (i: any) => apiItemToUnified(i)
        )
      );
      setTransactionItems(
        (transactionsRes.data?.data || transactionsRes.data || []).map(
          (i: any) => apiItemToUnified(i)
        )
      );

      setBanks(
        (banksRes.data?.data || banksRes.data || []).map((b: any) => ({
          id: b.id,
          name: b.name,
        }))
      );

      setCategories(
        (categoriesRes.data?.data || categoriesRes.data || []).map(
          (c: any) => ({
            id: c.id,
            name: c.name,
          })
        )
      );
    } catch {
      showErrorToast("Erro ao carregar dados", "Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ------------------------------------------------------------------------
   * Unified items + filters + sorting
   * ----------------------------------------------------------------------*/
  const allItems = useMemo(
    () => [...sheetItems, ...transactionItems],
    [sheetItems, transactionItems]
  );

  const filtered = useMemo(() => {
    const t = normalize(search);

    const list = allItems.filter((i) => {
      if (!t) return true;

      const fields = [
        normalize(i.description || ""),
        normalize(i.category?.name || ""),
        normalize(i.bank?.name || ""),
        normalize(String(i.value)),
        normalize(i.type === "income" ? "entrada" : "saida"),
        normalize(formatDateToText(i.date)),
        normalize(formatDateToText(i.paid_at)),
        normalize(i.origin === "sheet" ? "planilha" : "transacao"),
        normalize(i.paid_at ? "pago" : "nao pago"),
      ];

      return fields.some((f) => f.includes(t));
    });

    return list.sort((a, b) => {
      let A: any;
      let B: any;

      switch (sortField) {
        case "value":
          A = a.value;
          B = b.value;
          break;
        case "category":
          A = normalize(a.category?.name || "");
          B = normalize(b.category?.name || "");
          break;
        case "bank":
          A = normalize(a.bank?.name || "");
          B = normalize(b.bank?.name || "");
          break;
        case "type":
          A = a.type;
          B = b.type;
          break;
        case "origin":
          A = a.origin;
          B = b.origin;
          break;
        case "date":
        default:
          A = a.date || "";
          B = b.date || "";
          break;
      }

      if (A < B) return direction === "asc" ? -1 : 1;
      if (A > B) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [allItems, search, sortField, direction]);

  /* ------------------------------------------------------------------------
   * Summary cards
   * ----------------------------------------------------------------------*/
  const entradas = filtered
    .filter((i) => i.type === "income")
    .reduce((s, i) => s + i.value, 0);

  const saidas = filtered
    .filter((i) => i.type === "expense")
    .reduce((s, i) => s + i.value, 0);

  const saldoFinal = sheet ? sheet.initial_balance + entradas - saidas : 0;

  /* ------------------------------------------------------------------------
   * Sheet update
   * ----------------------------------------------------------------------*/
  async function updateSheet(field: keyof Sheet, value: any) {
    if (!sheet) return;

    try {
      if (field === "initial_balance") {
        setUpdatingInitialBalance(true);
      }

      const payload: any = {};
      payload[field] = field === "initial_balance" ? Number(value) : value;

      const res = await api.put(`/sheets/${sheet.id}`, payload);
      const updated = res.data?.data ?? payload;

      setSheet((prev) =>
        prev
          ? {
              ...prev,
              ...updated,
              initial_balance: Number(
                updated.initial_balance ?? prev.initial_balance
              ),
            }
          : prev
      );

      showSuccessToast("Planilha atualizada");
    } catch {
      showErrorToast("Erro ao atualizar planilha");
    } finally {
      if (field === "initial_balance") {
        setUpdatingInitialBalance(false);
      }
    }
  }

  /* ------------------------------------------------------------------------
   * Local-only inline item update
   * ----------------------------------------------------------------------*/
  function updateLocalItemField(
    item: UnifiedItem,
    field:
      | "value"
      | "category_id"
      | "date"
      | "description"
      | "type"
      | "bank_id"
      | "paid_at",
    value: any
  ) {
    const updateList = (prev: UnifiedItem[]) =>
      prev.map((i) => {
        if (i.id !== item.id || i.origin !== item.origin) return i;
        const clone: UnifiedItem = { ...i };

        if (field === "value") {
          clone.value = value ? Number(value) : 0;
        } else if (field === "category_id") {
          clone.category_id = value ? Number(value) : null;
        } else if (field === "bank_id") {
          clone.bank_id = value ? Number(value) : null;
        } else if (field === "type") {
          clone.type = value as ItemType;
        } else if (field === "date") {
          clone.date = value || null;
        } else if (field === "description") {
          clone.description = value || "";
        } else if (field === "paid_at") {
          clone.paid_at = value || null;
        }

        return clone;
      });

    if (item.origin === "sheet") setSheetItems(updateList);
    else setTransactionItems(updateList);
  }

  /* ------------------------------------------------------------------------
 * Full inline item update (API)
 * ----------------------------------------------------------------------*/
async function updateInline(
  item: UnifiedItem,
  field:
    | "value"
    | "category_id"
    | "date"
    | "description"
    | "type"
    | "bank_id"
    | "paid_at",
  value: any
) {
  const key = `${item.origin}-${item.id}`;

  try {
    setUpdatingInlineKey(key);

    const endpoint =
      item.origin === "sheet"
        ? `/sheets/${sheet?.id}/items/${item.id}`
        : `/transactions/${item.id}`;

    const payload: any = {};

    if (field === "value") {
      payload.value = value ? Number(value) : null;
    } else if (field === "category_id") {
      payload.category_id = value ? Number(value) : null;
    } else if (field === "bank_id") {
      payload.bank_id = value ? Number(value) : null;
    } else if (field === "type") {
      payload.type = value;
    } else if (field === "date") {
      payload.date = value || null;
    } else if (field === "description") {
      payload.description = value || null;
    } else if (field === "paid_at") {
      payload.paid_at = value || null;
    }

    const res = await api.put(endpoint, payload);
    const updatedRaw = res.data?.data ?? null;

    if (updatedRaw) {
      if (payload.paid_at && !updatedRaw.paid_at) {
        updatedRaw.paid_at = payload.paid_at;
      }

      // Também normalizamos caso backend devolva formato incorreto
      updatedRaw.paid_at = normalizeIsoDate(updatedRaw.paid_at);
      updatedRaw.date = normalizeIsoDate(updatedRaw.date);
    }

    const updatedUnified = updatedRaw ? apiItemToUnified(updatedRaw) : null;

    const updateList = (prev: UnifiedItem[]) =>
      prev.map((i) => {
        if (i.id !== item.id || i.origin !== item.origin) return i;
        if (updatedUnified) return updatedUnified;

        // fallback total
        const clone: UnifiedItem = { ...i };

        if (field === "value") clone.value = Number(value);
        else if (field === "category_id")
          clone.category_id = value ? Number(value) : null;
        else if (field === "bank_id")
          clone.bank_id = value ? Number(value) : null;
        else if (field === "type") clone.type = value as ItemType;
        else if (field === "date")
          clone.date = normalizeIsoDate(value || null);
        else if (field === "description")
          clone.description = value || null;
        else if (field === "paid_at")
          clone.paid_at = normalizeIsoDate(value || null);

        return clone;
      });

    if (item.origin === "sheet") setSheetItems(updateList);
    else setTransactionItems(updateList);

    setLastUpdatedKey(key);
    showSuccessToast("Item atualizado", "As alterações foram salvas.");

    setTimeout(() => {
      setLastUpdatedKey((prev) => (prev === key ? null : prev));
    }, 1200);
  } catch {
    showErrorToast("Erro ao atualizar item", "Tente novamente.");
  } finally {
    setUpdatingInlineKey((prev) => (prev === key ? null : prev));
    setPaidPopoverKey((prev) => (prev === key ? null : prev));
  }
}

  /* ------------------------------------------------------------------------
   * Delete item
   * ----------------------------------------------------------------------*/
  async function deleteInline(item: UnifiedItem) {
    const c = await Swal.fire({
      title: "Excluir item?",
      text: "Essa ação não poderá ser desfeita.",
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

    if (!c.isConfirmed) return;

    try {
      if (item.origin === "sheet") {
        await api.delete(`/sheets/${sheet?.id}/items/${item.id}`);
        setSheetItems((p) => p.filter((i) => i.id !== item.id));
      } else {
        await api.delete(`/transactions/${item.id}`);
        setTransactionItems((p) => p.filter((i) => i.id !== item.id));
      }

      showSuccessToast("Item removido", "O item foi excluído com sucesso.");
    } catch {
      showErrorToast("Erro ao excluir item");
    }
  }

  /* ------------------------------------------------------------------------
   * Delete sheet
   * ----------------------------------------------------------------------*/
  async function deleteSheet() {
    if (!id || deletingSheet) return;

    const c = await Swal.fire({
      title: "Excluir planilha?",
      text: "Isso removerá permanentemente a planilha.",
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

    if (!c.isConfirmed) return;

    try {
      setDeletingSheet(true);

      Swal.fire({
        title: "Excluindo planilha...",
        html: "Aguarde enquanto removemos seus dados com segurança.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        customClass: {
          popup: "rounded-3xl",
        },
      });

      await api.delete(`/sheets/${id}`);

      Swal.close();
      showSuccessToast("Planilha excluída");
      navigate("/sheets");
    } catch {
      Swal.close();
      showErrorToast("Erro ao excluir planilha");
    } finally {
      setDeletingSheet(false);
    }
  }

  /* ------------------------------------------------------------------------
   * Modal helpers
   * ----------------------------------------------------------------------*/
  function openEditSheetModal() {
    if (!sheet) return;

    setSheetForm({
      name: sheet.name,
      description: sheet.description || "",
      month: String(sheet.month),
      year: String(sheet.year),
      initial_balance: String(sheet.initial_balance),
    });

    setShowSheetModal(true);
  }

  function openCreateItemModal() {
    setModalMode("create");
    setEditingItem(null);
    setItemForm(EMPTY_FORM);
    setShowItemModal(true);
  }

  function openEditItemModal(item: UnifiedItem) {
    setModalMode("edit");
    setEditingItem(item);

    setItemForm({
      type: item.type,
      value: String(item.value),
      category_id: item.category_id ? String(item.category_id) : "",
      bank_id: item.bank_id ? String(item.bank_id) : "",
      description: item.description || "",
      date: item.date || "",
      paid_at: item.paid_at || "",
    });

    setShowItemModal(true);
  }

  /* ------------------------------------------------------------------------
   * Save item from modal
   * ----------------------------------------------------------------------*/
  async function saveItemFromModal() {
    if (!id || !sheet || savingItem) return;

    if (!itemForm.value) {
      showWarningToast("Informe um valor", "O campo de valor é obrigatório.");
      return;
    }

    const payload: any = {
      type: itemForm.type,
      value: Number(itemForm.value),
      category_id: itemForm.category_id ? Number(itemForm.category_id) : null,
      bank_id: itemForm.bank_id ? Number(itemForm.bank_id) : null,
      description: itemForm.description || null,
      date: itemForm.date || null,
      paid_at:
        itemForm.type === "expense" && itemForm.paid_at
          ? itemForm.paid_at
          : null,
    };

    try {
      setSavingItem(true);

      if (modalMode === "create") {
        const res = await api.post(`/sheets/${id}/items`, payload);
        const created = res.data?.data ?? res.data;
        const unified = apiItemToUnified(created);
        setSheetItems((prev) => [...prev, unified]);

        showSuccessToast("Item adicionado", "O item foi criado com sucesso.");
      } else if (modalMode === "edit" && editingItem) {
        const endpoint =
          editingItem.origin === "sheet"
            ? `/sheets/${sheet.id}/items/${editingItem.id}`
            : `/transactions/${editingItem.id}`;

        const res = await api.put(endpoint, payload);
        const updated = res.data?.data || { ...editingItem.raw, ...payload };
        const unified = apiItemToUnified(updated);

        const apply = (prev: UnifiedItem[]) =>
          prev.map((it) =>
            it.id === unified.id && it.origin === unified.origin
              ? unified
              : it
          );

        if (editingItem.origin === "sheet") setSheetItems(apply);
        else setTransactionItems(apply);

        showSuccessToast("Item atualizado", "As alterações foram salvas.");
      }

      setShowItemModal(false);
      setEditingItem(null);
      setModalMode("create");
      setItemForm(EMPTY_FORM);
    } catch {
      showErrorToast("Erro ao salvar item", "Tente novamente.");
    } finally {
      setSavingItem(false);
    }
  }

  /* ------------------------------------------------------------------------
   * Save sheet from modal
   * ----------------------------------------------------------------------*/
  async function saveSheet() {
    if (!sheet || savingSheet) return;

    try {
      setSavingSheet(true);

      const payload = {
        name: sheetForm.name,
        description: sheetForm.description,
        month: Number(sheetForm.month),
        year: Number(sheetForm.year),
        initial_balance: Number(sheetForm.initial_balance),
      };

      const res = await api.put(`/sheets/${sheet.id}`, payload);
      const updated = res.data?.data ?? payload;

      setSheet({
        ...sheet,
        ...updated,
        initial_balance: Number(
          updated.initial_balance ?? sheet.initial_balance
        ),
      });

      setShowSheetModal(false);
      showSuccessToast("Planilha atualizada");
    } catch {
      showErrorToast("Erro ao atualizar planilha");
    } finally {
      setSavingSheet(false);
    }
  }

  /* ------------------------------------------------------------------------
   * Loading skeleton
   * ----------------------------------------------------------------------*/
  if (loading || !sheet) {
    return (
      <div className="animate-pulse space-y-6 p-8">
        <div className="h-12 bg-gray-200 rounded-2xl" />
        <div className="grid grid-cols-4 gap-4">
          <div className="h-28 bg-gray-200 rounded-3xl" />
          <div className="h-28 bg-gray-200 rounded-3xl" />
          <div className="h-28 bg-gray-200 rounded-3xl" />
          <div className="h-28 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------
   * Main view
   * ----------------------------------------------------------------------*/
  return (
    <div className="animate-fadeIn space-y-10 pb-20">
      {/* Header / ações */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white rounded-3xl px-6 py-6 shadow-sm border border-[#E6E1F7]">
        <div className="flex items-center gap-4">
          <Link
            to="/sheets"
            className="flex items-center gap-2 text-[#7B61FF] hover:underline"
          >
            <ArrowLeft /> Voltar
          </Link>

          <div>
            <h1 className="text-2xl font-semibold text-[#2F2F36]">
              {sheet.name}
            </h1>
            {sheet.description && (
              <p className="text-xs text-gray-500 mt-1">{sheet.description}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center gap-3">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por descrição, categoria, banco, pago..."
              className="border rounded-xl pl-10 pr-3 py-2 w-full md:w-64 focus:outline-[#7B61FF]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Ordenar */}
          <div className="relative">
            <button
              className="cursor-pointer bg-white border rounded-xl px-3 py-2 flex items-center gap-2 hover:bg-gray-50"
              onClick={() => setSortMenuOpen((p) => !p)}
            >
              {direction === "asc" ? (
                <SortAsc size={18} />
              ) : (
                <SortDesc size={18} />
              )}
              <span className="text-sm text-gray-600">Ordenar</span>
              <ChevronDown size={14} />
            </button>

            {sortMenuOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded-xl shadow-lg p-2 w-52 z-10 text-sm">
                {[
                  { key: "date", label: "Data" },
                  { key: "value", label: "Valor" },
                  { key: "category", label: "Categoria" },
                  { key: "bank", label: "Banco" },
                  { key: "type", label: "Tipo (Entrada/Saída)" },
                  { key: "origin", label: "Origem (Planilha/Transação)" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      if (sortField === opt.key) {
                        setDirection((d) => (d === "asc" ? "desc" : "asc"));
                      } else {
                        setSortField(opt.key as SortField);
                        setDirection("asc");
                      }
                      setSortMenuOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 ${
                      sortField === opt.key ? "font-semibold" : ""
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Editar planilha */}
          <button
            onClick={openEditSheetModal}
            className="bg-[#E6F0FF] text-[#2F4A8A] px-4 py-2 rounded-xl border border-[#C3D7FF] flex items-center justify-center gap-2 hover:bg-[#d9e8ff]"
          >
            <Pencil size={16} /> Editar planilha
          </button>

          {/* Excluir planilha */}
          <button
            onClick={deleteSheet}
            disabled={deletingSheet}
            className={`bg-red-50 text-red-600 px-4 py-2 rounded-xl border border-red-200 hover:bg-red-100 flex items-center justify-center gap-2 ${
              deletingSheet ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {deletingSheet ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Excluindo...
              </>
            ) : (
              <>
                <Trash2 size={16} /> Excluir planilha
              </>
            )}
          </button>

          {/* Novo item */}
          <button
            onClick={openCreateItemModal}
            className="bg-[#7B61FF] text-white px-5 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-[#6A54E6]"
          >
            <Plus size={18} /> Novo item
          </button>
        </div>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Saldo inicial */}
        <div className="bg-white border rounded-3xl p-6 shadow-sm border-[#F4D6E3] hover:shadow-md transition cursor-pointer">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-700">Saldo Inicial</h3>
            <Coins className="text-[#E76BA3]" />
          </div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-2xl font-bold text-[#E76BA3]">R$</span>
            <div className="flex-1 flex items-center gap-2">
              <input
                type="number"
                className="text-2xl font-bold text-[#E76BA3] bg-transparent border-b w-full focus:outline-none focus:border-[#7B61FF]"
                defaultValue={sheet.initial_balance}
                onBlur={(e) =>
                  updateSheet("initial_balance", Number(e.target.value))
                }
              />
              {updatingInitialBalance && (
                <Loader2 size={20} className="animate-spin text-[#7B61FF]" />
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Este valor é o ponto de partida para o cálculo de saldo da planilha.
          </p>
        </div>

        {/* Entradas */}
        <div className="bg-white border rounded-3xl p-6 shadow-sm border-[#E6E1F7] hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-700">Entradas</h3>
            <Coins className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {formatCurrency(entradas)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Soma de todas as receitas filtradas na lista abaixo.
          </p>
        </div>

        {/* Saídas */}
        <div className="bg-white border rounded-3xl p-6 shadow-sm border-[#E6E1F7] hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-700">Saídas</h3>
            <Coins className="text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {formatCurrency(saidas)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Despesas considerando o filtro atual (pagas ou em aberto).
          </p>
        </div>

        {/* Saldo final */}
        <div className="bg-white border rounded-3xl p-6 shadow-sm border-[#E6E1F7] hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-700">Saldo Final</h3>
            <Coins className="text-[#7B61FF]" />
          </div>
          <p className="text-2xl font-bold text-[#7B61FF] mt-2">
            {formatCurrency(saldoFinal)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Cálculo: saldo inicial + entradas - saídas.
          </p>
        </div>
      </div>

      {/* Lista de transações */}
      <div className="bg-white border rounded-3xl p-6 shadow-sm border-[#E6E1F7]">
        <h2 className="text-xl font-semibold mb-4">Transações</h2>

        <div className="space-y-4">
          {filtered.map((item) => {
            const isIncome = item.type === "income";
            const isPaid = !!item.paid_at;
            const overdue = isOverdue(item);
            const key = `${item.origin}-${item.id}`;
            const showUpdated = lastUpdatedKey === key;
            const isUpdating = updatingInlineKey === key;

            const CategoryIcon = getCategoryIconComponent(
              item.category?.name || ""
            );

            // Entrada OU despesa paga → card verde.
            // Despesa em aberto → card rosado.
            const wrapperColorClass =
              isIncome || isPaid
                ? "bg-[#E8F7EE] border-[#C8EED3]"
                : "bg-[#FCECEC] border-[#F5BFBF]";

            const paidBadgeText = isPaid
              ? `Pago em ${formatDateToText(item.paid_at)}`
              : "";

            const overdueBadgeText =
              !isPaid && overdue
                ? `Vencido em ${formatDateToText(item.date)}`
                : "Vencido";

            return (
              <div
                key={key}
                className={`relative grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch p-4 rounded-2xl border transition-shadow ${wrapperColorClass} shadow-[0_1px_4px_rgba(15,23,42,0.04)]`}
              >
                {/* Badge de status (topo esquerdo) */}
                {!isIncome && isPaid && (
                  <div className="absolute -top-3 left-4 bg-emerald-600 text-white text-[11px] px-3 py-1 rounded-full flex items-center gap-1 shadow">
                    <CheckCircle2 size={12} />
                    <span>{paidBadgeText}</span>
                  </div>
                )}

                {!isIncome && !isPaid && overdue && (
                  <div className="absolute -top-3 left-4 bg-red-600 text-white text-[11px] px-3 py-1 rounded-full flex items-center gap-1 shadow">
                    <AlertTriangle size={12} />
                    <span>{overdueBadgeText}</span>
                  </div>
                )}

                {/* Valor / Tipo */}
                <div className="flex flex-col gap-1 lg:col-span-3">
                  <span className="text-[11px] text-gray-500">Valor / Tipo</span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex items-center gap-2 bg-white/90 rounded-full px-3 py-2 shadow-sm flex-1 min-w-[150px]">
                      <DollarSign
                        className={isIncome ? "text-green-600" : "text-red-600"}
                        size={18}
                      />
                      <input
                        type="number"
                        className="bg-transparent text-sm font-semibold focus:outline-none w-full"
                        value={item.value}
                        onChange={(e) =>
                          updateLocalItemField(
                            item,
                            "value",
                            e.target.value ? Number(e.target.value) : 0
                          )
                        }
                        onBlur={(e) =>
                          updateInline(
                            item,
                            "value",
                            e.target.value ? Number(e.target.value) : 0
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center gap-2 bg-white/90 rounded-full px-3 py-2 shadow-sm w-full sm:w-40">
                      <Coins
                        className={isIncome ? "text-green-600" : "text-red-600"}
                        size={16}
                      />
                      <select
                        className="bg-transparent text-[11px] font-medium uppercase tracking-wide focus:outline-none w-full"
                        value={item.type}
                        onChange={(e) => {
                          const newType = e.target.value as ItemType;
                          updateLocalItemField(item, "type", newType);
                          updateInline(item, "type", newType);
                        }}
                      >
                        <option value="income">Entrada</option>
                        <option value="expense">Saída</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Categoria */}
                <div className="flex flex-col gap-1 lg:col-span-2">
                  <span className="text-[11px] text-gray-500">Categoria</span>
                  <div className="flex items-center gap-2 bg-white/90 rounded-full px-3 py-2 shadow-sm w-full">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-700">
                      <CategoryIcon size={14} />
                    </div>
                    <select
                      className="bg-transparent text-xs focus:outline-none w-full"
                      value={item.category_id ?? ""}
                      onChange={(e) => {
                        const rawValue = e.target.value;
                        const val = rawValue ? Number(rawValue) : null;
                        updateLocalItemField(item, "category_id", val);
                        updateInline(item, "category_id", val);
                      }}
                    >
                      <option value="">Sem categoria</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Banco */}
                <div className="flex flex-col gap-1 lg:col-span-2">
                  <span className="text-[11px] text-gray-500">Banco</span>
                  <div className="flex items-center gap-2 bg-white/90 rounded-full px-3 py-2 shadow-sm w-full">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-600">
                      <Landmark size={14} />
                    </div>
                    <select
                      className="bg-transparent text-xs focus:outline-none w-full"
                      value={item.bank_id ?? ""}
                      onChange={(e) => {
                        const rawValue = e.target.value;
                        const val = rawValue ? Number(rawValue) : null;
                        updateLocalItemField(item, "bank_id", val);
                        updateInline(item, "bank_id", val);
                      }}
                    >
                      <option value="">Sem banco</option>
                      {banks.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Vencimento */}
                <div className="flex flex-col gap-1 lg:col-span-2">
                  <span className="text-[11px] text-gray-500">
                    Data de vencimento
                  </span>
                  <div className="flex items-center gap-2 bg-white/90 rounded-full px-3 py-2 shadow-sm w-full">
                    <Calendar size={16} className="text-gray-500" />
                    <input
                      type="date"
                      className="bg-transparent text-xs focus:outline-none w-full"
                      value={item.date || ""}
                      onChange={(e) =>
                        updateLocalItemField(
                          item,
                          "date",
                          normalizeIsoDate(e.target.value)
                        )
                      }
                      onBlur={(e) =>
                        updateInline(
                          item,
                          "date",
                          normalizeIsoDate(e.target.value)
                        )
                      }
                    />
                  </div>
                  {isPaid && (
                    <span className="mt-1 text-[11px] text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 size={11} />
                      Pago em {formatDateToText(item.paid_at)}
                    </span>
                  )}
                  {!isPaid && overdue && (
                    <span className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
                      <AlertTriangle size={11} />
                      Vencido desde {formatDateToText(item.date)}
                    </span>
                  )}
                </div>

                {/* Descrição + origem + ações / pagamento */}
                <div className="flex flex-col gap-2 lg:col-span-3">
                  {/* Linha de origem + estado de salvamento */}
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      {item.origin === "sheet" ? (
                        <span className="px-3 py-1 rounded-full text-[11px] bg-[#E6F0FF] text-[#2F4A8A] border border-[#C3D7FF]">
                          Planilha
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[11px] bg-[#F7EFFF] text-[#7B61FF] border border-[#E7D9FF] flex items-center gap-1">
                          <LinkIcon size={12} /> Transação
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isUpdating && (
                        <span className="flex items-center gap-1 text-xs text-[#7B61FF]">
                          <Loader2 size={14} className="animate-spin" />
                          atualizando...
                        </span>
                      )}

                      {showUpdated && !isUpdating && (
                        <span className="flex items-center gap-1 text-green-600 text-xs">
                          <CheckCircle2 size={14} /> salvo
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Descrição */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-gray-500">Descrição</span>
                    <div className="flex items-center gap-2 bg-white/90 rounded-full px-3 py-2 shadow-sm w-full">
                      <input
                        type="text"
                        placeholder="Descrição"
                        className="bg-transparent text-xs focus:outline-none w-full"
                        value={item.description || ""}
                        onChange={(e) =>
                          updateLocalItemField(
                            item,
                            "description",
                            e.target.value
                          )
                        }
                        onBlur={(e) =>
                          updateInline(item, "description", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Ações + pagamento */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    {/* Pagamento inline (somente despesas) */}
                    {!isIncome && (
                      <div className="relative">
                        {!isPaid ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setPaidPopoverKey((prev) =>
                                  prev === key ? null : key
                                )
                              }
                              className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                            >
                              <CheckCircle2 size={12} />
                              Pagar
                              <ChevronDown size={12} />
                            </button>

                            {paidPopoverKey === key && (
                              <div className="absolute right-0 mt-2 w-64 bg-white border border-emerald-100 rounded-2xl shadow-lg p-3 text-xs z-20">
                                <p className="text-gray-600">
                                  Esta despesa será marcada como{" "}
                                  <span className="font-semibold text-emerald-700">
                                    paga hoje
                                  </span>{" "}
                                  (
                                  {formatDateToText(getTodayIso())}
                                  ).
                                </p>
                                <div className="flex justify-end gap-2 mt-3">
                                  <button
                                    type="button"
                                    className="px-3 py-1 rounded-full border text-[11px] text-gray-500 hover:bg-gray-50"
                                    onClick={() => setPaidPopoverKey(null)}
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isUpdating}
                                    className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] hover:bg-emerald-700 flex items-center gap-1 disabled:opacity-60"
                                    onClick={() => {
                                      const today = getTodayIso();
                                      // Atualização otimista local: card já fica verde e badge muda
                                      updateLocalItemField(
                                        item,
                                        "paid_at",
                                        today
                                      );
                                      setPaidPopoverKey(null);
                                      updateInline(item, "paid_at", today);
                                    }}
                                  >
                                    {isUpdating ? (
                                      <Loader2
                                        size={11}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <CheckCircle2 size={11} />
                                    )}
                                    Confirmar pagamento
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setPaidPopoverKey((prev) =>
                                  prev === key ? null : key
                                )
                              }
                              className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                            >
                              <CheckCircle2 size={12} />
                              Pago em {formatDateToText(item.paid_at)}
                              <ChevronDown size={12} />
                            </button>

                            {paidPopoverKey === key && (
                              <div className="absolute right-0 mt-2 w-64 bg-white border border-emerald-100 rounded-2xl shadow-lg p-3 text-xs z-20">
                                <p className="text-gray-600">
                                  Este lançamento está marcado como{" "}
                                  <span className="font-semibold text-emerald-700">
                                    pago
                                  </span>{" "}
                                  em {formatDateToText(item.paid_at)}.
                                </p>
                                <div className="flex justify-end gap-2 mt-3">
                                  <button
                                    type="button"
                                    className="px-3 py-1 rounded-full border text-[11px] text-gray-500 hover:bg-gray-50"
                                    onClick={() => setPaidPopoverKey(null)}
                                  >
                                    Fechar
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isUpdating}
                                    className="px-3 py-1 rounded-full bg-red-500 text-white text-[11px] hover:bg-red-600 disabled:opacity-60"
                                    onClick={() => {
                                      // Atualização otimista local: remove pagamento e card pode voltar a vermelho
                                      updateLocalItemField(
                                        item,
                                        "paid_at",
                                        null
                                      );
                                      setPaidPopoverKey(null);
                                      updateInline(item, "paid_at", null);
                                    }}
                                  >
                                    {isUpdating ? (
                                      <Loader2
                                        size={11}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      "Remover pagamento"
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* Ações: editar / excluir */}
                    <div className="flex items-center gap-3 ml-auto">
                      <button
                        className="text-[#7B61FF] text-xs flex items-center gap-1 hover:underline"
                        onClick={() => openEditItemModal(item)}
                      >
                        <Pencil size={14} />
                        Editar
                      </button>

                      <button
                        className="text-red-600 text-xs flex items-center gap-1 hover:underline"
                        onClick={() => deleteInline(item)}
                      >
                        <Trash2 size={14} />
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-6">
              Nenhuma transação encontrada com os filtros atuais.
            </p>
          )}
        </div>
      </div>

      {/* Modal: editar planilha */}
      {showSheetModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-[95%] max-w-xl p-6 shadow-lg border border-[#E6E1F7] animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Editar planilha</h2>
              <button
                onClick={() => setShowSheetModal(false)}
                className="text-gray-600 hover:text-black"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">
                  Nome da planilha
                </label>
                <input
                  type="text"
                  className="border rounded-xl px-3 py-2 w-full outline-none"
                  value={sheetForm.name}
                  onChange={(e) =>
                    setSheetForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Descrição</label>
                <textarea
                  className="border rounded-xl px-3 py-2 w-full outline-none"
                  value={sheetForm.description}
                  onChange={(e) =>
                    setSheetForm((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Mês</label>
                  <input
                    type="number"
                    className="border rounded-xl px-3 py-2 w-full outline-none"
                    value={sheetForm.month}
                    onChange={(e) =>
                      setSheetForm((p) => ({
                        ...p,
                        month: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Ano</label>
                  <input
                    type="number"
                    className="border rounded-xl px-3 py-2 w-full outline-none"
                    value={sheetForm.year}
                    onChange={(e) =>
                      setSheetForm((p) => ({
                        ...p,
                        year: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Saldo inicial</label>
                <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
                  <Coins className="text-[#7B61FF]" />
                  <input
                    type="number"
                    className="w-full bg-transparent outline-none"
                    value={sheetForm.initial_balance}
                    onChange={(e) =>
                      setSheetForm((p) => ({
                        ...p,
                        initial_balance: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <button
                onClick={saveSheet}
                disabled={savingSheet}
                className="bg-[#7B61FF] text-white rounded-xl px-5 py-3 w-full mt-4 font-medium hover:bg-[#6A54E6] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {savingSheet ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar alterações"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: novo / editar item */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white rounded-3xl w-[95%] max-w-lg p-6 shadow-xl border border-[#E6E1F7] animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {modalMode === "create" ? "Novo item" : "Editar item"}
              </h2>
              <button
                onClick={() => {
                  setShowItemModal(false);
                  setEditingItem(null);
                  setModalMode("create");
                  setItemForm(EMPTY_FORM);
                }}
                className="text-gray-500 hover:text-black"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm text-gray-600">Tipo</label>
                <div className="flex items-center gap-2 border rounded-xl p-2">
                  <Coins
                    className={
                      itemForm.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  />
                  <select
                    className="w-full bg-transparent outline-none"
                    value={itemForm.type}
                    onChange={(e) =>
                      setItemForm((prev) => ({
                        ...prev,
                        type: e.target.value as ItemType,
                        paid_at:
                          e.target.value === "income" ? "" : prev.paid_at,
                      }))
                    }
                  >
                    <option value="income">Entrada</option>
                    <option value="expense">Saída</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Valor</label>
                <div className="flex items-center gap-2 border rounded-xl p-2">
                  <DollarSign className="text-gray-400" />
                  <input
                    type="number"
                    placeholder="0,00"
                    className="w-full bg-transparent outline-none"
                    value={itemForm.value}
                    onChange={(e) =>
                      setItemForm((prev) => ({
                        ...prev,
                        value: e.target.value,
                      }))
                    }
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Informe apenas números. Os centavos serão considerados
                  automaticamente.
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-600">Categoria</label>
                <div className="flex items-center gap-2 border rounded-xl p-2">
                  {(() => {
                    const selectedCategory = categories.find(
                      (c) => String(c.id) === itemForm.category_id
                    );
                    const ModalCategoryIcon = getCategoryIconComponent(
                      selectedCategory?.name || ""
                    );
                    return <ModalCategoryIcon className="text-gray-400" />;
                  })()}
                  <select
                    className="w-full bg-transparent outline-none"
                    value={itemForm.category_id}
                    onChange={(e) =>
                      setItemForm((prev) => ({
                        ...prev,
                        category_id: e.target.value,
                      }))
                    }
                  >
                    <option value="">Sem categoria</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Banco</label>
                <div className="flex items-center gap-2 border rounded-xl p-2">
                  <Landmark className="text-gray-400" />
                  <select
                    className="w-full bg-transparent outline-none"
                    value={itemForm.bank_id}
                    onChange={(e) =>
                      setItemForm((prev) => ({
                        ...prev,
                        bank_id: e.target.value,
                      }))
                    }
                  >
                    <option value="">Sem banco</option>
                    {banks.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Data</label>
                <div className="flex items-center gap-2 border rounded-xl p-2">
                  <Calendar className="text-gray-400" />
                  <input
                    type="date"
                    className="w-full bg-transparent outline-none"
                    value={itemForm.date}
                    onChange={(e) =>
                      setItemForm((prev) => ({
                        ...prev,
                        date: normalizeIsoDate(e.target.value) || "",
                      }))
                    }
                  />
                </div>
              </div>

              {itemForm.type === "expense" && (
                <div>
                  <label className="text-sm text-gray-600">
                    Pago em (opcional)
                  </label>
                  <div className="flex items-center gap-2 border rounded-xl p-2">
                    <CheckCircle2 className="text-gray-400" />
                    <input
                      type="date"
                      className="w-full bg-transparent outline-none"
                      value={itemForm.paid_at}
                      onChange={(e) =>
                        setItemForm((prev) => ({
                          ...prev,
                          paid_at: normalizeIsoDate(e.target.value) || "",
                        }))
                      }
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Se preencher esta data, a despesa será considerada como paga
                    e destacada em verde na lista.
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm text-gray-600">Descrição</label>
                <textarea
                  placeholder="Detalhes..."
                  className="border rounded-xl p-3 w-full outline-none"
                  value={itemForm.description}
                  onChange={(e) =>
                    setItemForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <button
                onClick={saveItemFromModal}
                disabled={savingItem}
                className="bg-[#7B61FF] text-white rounded-xl px-5 py-3 font-medium hover:bg-[#6A54E6] transition mt-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {savingItem ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Salvando...
                  </>
                ) : modalMode === "create" ? (
                  "Adicionar"
                ) : (
                  "Salvar alterações"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
