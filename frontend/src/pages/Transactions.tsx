import { useEffect, useState } from "react";
import { api } from "../services/api";
import {
  Plus,
  Search,
  ArrowUpDown,
  Trash2,
  Pencil,
  Receipt,
  Tag,
  X,
  Calendar,
  DollarSign,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import Swal from "sweetalert2";

/* ============================================================================
 * BLOCKDOC: Domain types
 * ----------------------------------------------------------------------------
 * These interfaces describe the shape of transaction and sheet item entities
 * as they are consumed by this screen.
 * ==========================================================================*/
interface Transaction {
  id: number;
  description: string;
  value: number;
  type: "income" | "expense";
  category: { id: number; name: string } | null;
  sheet_id: number | null;
  created_at: string;
  date?: string | null;
}

interface SheetItem {
  id: number;
  description: string;
  value: number;
  type: "income" | "expense";
  category: { id: number; name: string } | null;
  sheet_id: number | null;
  created_at: string;
  date?: string | null;
  paid_at?: string | null;
}

interface Category {
  id: number;
  name: string;
}

type OriginFilter = "all" | "linked" | "unlinked";

type EditTarget =
  | { kind: "transaction"; id: number }
  | { kind: "sheetitem"; id: number }
  | null;

/* ============================================================================
 * BLOCKDOC: Global SweetAlert2 toast system
 * ----------------------------------------------------------------------------
 * Small, pastel toasts used for lightweight feedback across the whole screen.
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
 * BLOCKDOC: Helper functions (normalization, dates, money)
 * ----------------------------------------------------------------------------
 * Helpers reused across filters, payment logic and display formatting.
 * ==========================================================================*/

/** Normalizes raw type strings (API or DB) into the internal union type. */
function normalizeType(raw: any): "income" | "expense" {
  if (raw === "income" || raw === "entrada") return "income";
  return "expense";
}

/** Safely extracts arrays from different API envelope formats. */
function extractArray(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

/** Normalizes many date formats to `YYYY-MM-DD` or returns null. */
function normalizeIsoDate(input: string | null | undefined): string | null {
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

/** Formats an ISO-like date string into pt-BR human readable text. */
function formatDateToText(date: string | null | undefined) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR");
}

/** Returns today's date in `YYYY-MM-DD` format. */
function getTodayIso() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Returns true if a sheet item is an overdue expense (unpaid and past due). */
function isOverdueSheetItem(item: SheetItem) {
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

/** User-friendly currency formatter (BRL, pt-BR). */
function formatCurrency(value: number) {
  if (value == null || isNaN(value)) return "R$ 0,00";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

/** Maps raw transaction payload into the internal Transaction type. */
function normalizeTransactionData(t: any): Transaction {
  return {
    id: t.id,
    description: t.description ?? "",
    value: Number(t.value),
    type: normalizeType(t.type),
    category: t.category ?? null,
    sheet_id: t.sheet_id ?? null,
    created_at: t.created_at,
    date: t.date ?? null,
  };
}

/** Maps raw sheet item payload into the internal SheetItem type. */
function normalizeSheetItemData(s: any): SheetItem {
  return {
    id: s.id,
    description: s.description ?? "",
    value: Number(s.value),
    type: normalizeType(s.type),
    category: s.category ?? null,
    sheet_id: s.sheet_id ?? null,
    created_at: s.created_at,
    date: s.date ?? null,
    paid_at: normalizeIsoDate(s.paid_at ?? null),
  };
}

/* ============================================================================
 * BLOCKDOC: Transactions screen
 * ----------------------------------------------------------------------------
 * A unified view of:
 * - free transactions (Transactions module)
 * - sheet items (Sheets module)
 *
 * It provides global filters, summaries, inline editing for both,
 * and inline payment flow for sheet items.
 * ==========================================================================*/
export default function Transactions() {
  /* ------------------------------------------------------------------------
   * BLOCKDOC: Core data state
   * ----------------------------------------------------------------------*/
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sheetItems, setSheetItems] = useState<SheetItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  /* ------------------------------------------------------------------------
   * BLOCKDOC: Filters and sorting
   * ----------------------------------------------------------------------*/
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [originFilter, setOriginFilter] = useState<OriginFilter>("all");
  const [sortAsc, setSortAsc] = useState(true);

  /* ------------------------------------------------------------------------
   * BLOCKDOC: Modal state (transaction / sheet item create & edit)
   * ----------------------------------------------------------------------*/
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<EditTarget>(null);

  const [form, setForm] = useState({
    description: "",
    value: "",
    type: "income" as "income" | "expense",
    category_id: "",
    date: "",
  });

  const [saving, setSaving] = useState(false);

  /* ------------------------------------------------------------------------
   * BLOCKDOC: Sheet item payment inline helpers
   * ----------------------------------------------------------------------*/
  const [sheetPaidPopoverId, setSheetPaidPopoverId] = useState<number | null>(
    null
  );
  const [updatingSheetItemId, setUpdatingSheetItemId] = useState<number | null>(
    null
  );

  /* ------------------------------------------------------------------------
   * BLOCKDOC: Initial data loading (transactions + sheet items + categories)
   * ----------------------------------------------------------------------*/
  async function loadData() {
    try {
      setLoading(true);

      const [tRes, sRes, cRes] = await Promise.all([
        api.get("/transactions"),
        api.get("/sheet-items"),
        api.get("/categories"),
      ]);

      const rawTransactions = extractArray(tRes.data);
      const rawSheetItems = extractArray(sRes.data);
      const rawCategories = extractArray(cRes.data);

      setCategories(rawCategories);

      setTransactions(
        rawTransactions.map((t: any) => normalizeTransactionData(t))
      );

      setSheetItems(
        rawSheetItems.map((s: any) => normalizeSheetItemData(s))
      );
    } catch (error) {
      console.error(error);
      setTransactions([]);
      setSheetItems([]);
      showErrorToast("Erro ao carregar dados", "Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  /* ------------------------------------------------------------------------
   * BLOCKDOC: Delete operations (transactions and sheet items)
   * ----------------------------------------------------------------------*/
  async function deleteTransaction(id: number) {
    const confirm = await Swal.fire({
      title: "Excluir transação?",
      text: "Esta ação não pode ser desfeita.",
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
      await api.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      showSuccessToast("Transação removida");
    } catch {
      showErrorToast("Erro ao excluir transação");
    }
  }

  async function deleteSheetItem(id: number) {
    const confirm = await Swal.fire({
      title: "Excluir item de planilha?",
      text: "Esta ação não pode ser desfeita.",
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
      await api.delete(`/sheet-items/${id}`);
      setSheetItems((prev) => prev.filter((s) => s.id !== id));
      showSuccessToast("Item de planilha removido");
    } catch {
      showErrorToast("Erro ao excluir item de planilha");
    }
  }

  /* ------------------------------------------------------------------------
 * BLOCKDOC: Inline payment for sheet items (optimistic update)
 * ----------------------------------------------------------------------*/
async function updateSheetItemPaidStatus(
  item: SheetItem,
  paidAt: string | null
) {
  try {
    setUpdatingSheetItemId(item.id);

    // 1) Atualização otimista imediata (UI muda antes do backend)
    const safePaidAt = normalizeIsoDate(paidAt);
    setSheetItems((prev) =>
      prev.map((s) =>
        s.id === item.id ? { ...s, paid_at: safePaidAt } : s
      )
    );

    // 2) Request oficial
    const payload: any = { paid_at: safePaidAt };
    const res = await api.put(`/sheet-items/${item.id}`, payload);

    let updatedRaw = res.data?.data ?? res.data ?? null;

    // 3) Correção crítica:
    // Se o backend não devolver paid_at, aplicamos exatamente o enviado.
    if (updatedRaw) {
      if (payload.paid_at && !updatedRaw.paid_at) {
        updatedRaw.paid_at = payload.paid_at;
      }
      // Normalização final
      updatedRaw.paid_at = normalizeIsoDate(updatedRaw.paid_at);
      updatedRaw.date = normalizeIsoDate(updatedRaw.date);
    }

    const normalized = updatedRaw
      ? normalizeSheetItemData(updatedRaw)
      : { ...item, paid_at: safePaidAt };

    // 4) Atualiza a store final
    setSheetItems((prev) =>
      prev.map((s) => (s.id === normalized.id ? normalized : s))
    );

    showSuccessToast("Item atualizado", "Status de pagamento atualizado.");
  } catch {
    showErrorToast("Erro ao atualizar item de planilha");
  } finally {
    setUpdatingSheetItemId((prev) => (prev === item.id ? null : prev));
    setSheetPaidPopoverId((prev) => (prev === item.id ? null : prev));
  }
}

  /* ------------------------------------------------------------------------
   * BLOCKDOC: Create / Edit flow (modal)
   * ----------------------------------------------------------------------*/
  async function handleSave() {
    if (!form.value || !form.description) {
      showWarningToast("Informe descrição e valor.");
      return;
    }

    const payload = {
      description: form.description,
      value: Number(form.value),
      type: form.type,
      category_id: form.category_id || null,
      date: form.date || null,
    };

    try {
      setSaving(true);

      if (!editing) {
        // Create new transaction
        const res = await api.post("/transactions", payload);
        const created = normalizeTransactionData(
          res.data.data ?? res.data
        );
        setTransactions((prev) => [created, ...prev]);
        showSuccessToast("Transação criada!");
      } else if (editing.kind === "transaction") {
        // Update existing transaction
        const res = await api.put(
          `/transactions/${editing.id}`,
          payload
        );
        const updated = normalizeTransactionData(res.data.data ?? res.data);
        setTransactions((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
        );
        showSuccessToast("Transação atualizada!");
      } else if (editing.kind === "sheetitem") {
        // Update existing sheet item
        const res = await api.put(
          `/sheet-items/${editing.id}`,
          payload
        );
        const updated = normalizeSheetItemData(res.data.data ?? res.data);
        setSheetItems((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s))
        );
        showSuccessToast("Item de planilha atualizado!");
      }

      setShowModal(false);
      setEditing(null);
      setForm({
        description: "",
        value: "",
        type: "income",
        category_id: "",
        date: "",
      });
    } catch (error: any) {
      showErrorToast(
        "Erro ao salvar",
        error?.response?.data?.message || "Falha ao salvar."
      );
    } finally {
      setSaving(false);
    }
  }

  function openCreateModal() {
    setEditing(null);
    setForm({
      description: "",
      value: "",
      type: "income",
      category_id: "",
      date: "",
    });
    setShowModal(true);
  }

  function openEditTransactionModal(t: Transaction) {
    setEditing({ kind: "transaction", id: t.id });
    setForm({
      description: t.description,
      value: String(t.value),
      type: t.type,
      category_id: t.category ? String(t.category.id) : "",
      date: t.date || "",
    });
    setShowModal(true);
  }

  function openEditSheetItemModal(s: SheetItem) {
    setEditing({ kind: "sheetitem", id: s.id });
    setForm({
      description: s.description,
      value: String(s.value),
      type: s.type,
      category_id: s.category ? String(s.category.id) : "",
      date: s.date || "",
    });
    setShowModal(true);
  }

  /* ------------------------------------------------------------------------
   * BLOCKDOC: Global summary (total income / expense / final balance)
   * ----------------------------------------------------------------------*/
  const totalIncome =
    transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.value, 0) +
    sheetItems
      .filter((s) => s.type === "income")
      .reduce((s, t) => s + t.value, 0);

  const totalExpense =
    transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.value, 0) +
    sheetItems
      .filter((s) => s.type === "expense")
      .reduce((s, t) => s + t.value, 0);

  const finalBalance = totalIncome - totalExpense;

  /* ------------------------------------------------------------------------
   * BLOCKDOC: Filters and sorting
   * ----------------------------------------------------------------------*/
  const searchLower = search.toLowerCase();

  function applyFilters<
    T extends {
      description: string;
      category: any;
      type: string;
      sheet_id: number | null;
    }
  >(list: T[]) {
    return list
      .filter((i) => {
        if (!searchLower) return true;
        return (
          i.description.toLowerCase().includes(searchLower) ||
          i.category?.name?.toLowerCase().includes(searchLower) ||
          (i.sheet_id ? String(i.sheet_id).includes(searchLower) : false)
        );
      })
      .filter((i) =>
        categoryFilter ? i.category?.id === Number(categoryFilter) : true
      )
      .filter((i) => (typeFilter ? i.type === typeFilter : true))
      .filter((i) => {
        if (originFilter === "linked") return i.sheet_id !== null;
        if (originFilter === "unlinked") return i.sheet_id === null;
        return true;
      })
      .sort((a, b) => {
        const A = a.description.toLowerCase();
        const B = b.description.toLowerCase();
        return sortAsc ? A.localeCompare(B) : B.localeCompare(A);
      });
  }

  const filteredTransactions = applyFilters(transactions);
  const filteredSheetItems = applyFilters(sheetItems);

  // Subtotals per table (filtered)
  const txIncomeFiltered = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.value, 0);

  const txExpenseFiltered = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.value, 0);

  const sheetIncomeFiltered = filteredSheetItems
    .filter((s) => s.type === "income")
    .reduce((s, t) => s + t.value, 0);

  const sheetExpenseFiltered = filteredSheetItems
    .filter((s) => s.type === "expense")
    .reduce((s, t) => s + t.value, 0);

  /* ------------------------------------------------------------------------
   * BLOCKDOC: Loading skeleton
   * ----------------------------------------------------------------------*/
  if (loading) {
    return (
      <div className="animate-fadeIn space-y-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border rounded-3xl p-6 animate-pulse border-[#E6E1F7]"
            >
              <div className="w-24 h-5 bg-gray-200 rounded-lg" />
              <div className="w-32 h-7 bg-gray-300 rounded-lg mt-3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------
   * BLOCKDOC: Main view (header, summary, filters, tables, modal)
   * ----------------------------------------------------------------------*/
  return (
    <div className="animate-fadeIn space-y-10 pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-[#2F2F36]">
          Transações
        </h1>

        <button
          onClick={openCreateModal}
          className="bg-[#7B61FF] text-white px-5 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-[#6A54E6] transition"
        >
          <Plus size={18} />
          Nova Transação
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-3xl p-6 border-[#E6E1F7]">
          <div className="flex justify-between">
            <h3 className="text-gray-700">Entradas (Total)</h3>
            <Receipt className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {formatCurrency(totalIncome)}
          </p>
        </div>

        <div className="bg-white border rounded-3xl p-6 border-[#E6E1F7]">
          <div className="flex justify-between">
            <h3 className="text-gray-700">Saídas (Total)</h3>
            <Receipt className="text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {formatCurrency(totalExpense)}
          </p>
        </div>

        <div className="bg-white border rounded-3xl p-6 border-[#E6E1F7]">
          <div className="flex justify-between">
            <h3 className="text-gray-700">Saldo Final</h3>
            <Receipt
              className={finalBalance >= 0 ? "text-green-600" : "text-red-600"}
            />
          </div>
          <p
            className={`text-2xl font-bold mt-2 ${
              finalBalance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(finalBalance)}
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border rounded-3xl p-6 border-[#E4E2F0] grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2 flex items-center gap-2 bg-[#FBFAFF] border rounded-xl px-4 py-3 border-[#E0DEED]">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por descrição, categoria, planilha..."
            className="w-full bg-transparent focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#FBFAFF] border rounded-xl px-4 py-3 text-[#3A3A45] border-[#E0DEED]"
        >
          <option value="">Categoria</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[#FBFAFF] border rounded-xl px-4 py-3 text-[#3A3A45] border-[#E0DEED]"
        >
          <option value="">Tipo</option>
          <option value="income">Entrada</option>
          <option value="expense">Saída</option>
        </select>

        <select
          value={originFilter}
          onChange={(e) => setOriginFilter(e.target.value as OriginFilter)}
          className="bg-[#FBFAFF] border rounded-xl px-4 py-3 text-[#3A3A45] border-[#E0DEED]"
        >
          <option value="all">Todas</option>
          <option value="unlinked">Somente Avulsas</option>
          <option value="linked">Somente Vinculadas</option>
        </select>
      </div>

      {/* TABLE 1 — TRANSAÇÕES */}
      <div className="bg-white border rounded-3xl shadow-sm overflow-hidden border-[#E4E2F0]">
        <div className="flex items-center justify-between px-4 pt-4">
          <div>
            <h2 className="text-lg font-semibold text-[#2F2F36]">
              Transações (Módulo Transações)
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Entradas:{" "}
              <span className="font-semibold text-green-600">
                {formatCurrency(txIncomeFiltered)}
              </span>{" "}
              · Saídas:{" "}
              <span className="font-semibold text-red-600">
                {formatCurrency(txExpenseFiltered)}
              </span>
            </p>
          </div>

          <button
            onClick={() => setSortAsc((p) => !p)}
            className="flex items-center gap-1 text-[#7B61FF] text-sm mr-2"
          >
            <ArrowUpDown size={14} /> Ordenar por descrição (
            {sortAsc ? "A-Z" : "Z-A"})
          </button>
        </div>

        <table className="w-full mt-3">
          <thead className="bg-[#F6F4FF] text-[#4B4A54]">
            <tr>
              <th className="p-4 text-left">Descrição</th>
              <th className="p-4 text-left">Categoria</th>
              <th className="p-4 text-left">Valor</th>
              <th className="p-4 text-left">Tipo</th>
              <th className="p-4 text-left">Origem</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map((t) => (
              <tr
                key={t.id}
                className={`border-t border-[#F1EEF9] hover:bg-[#FAF8FF] transition ${
                  t.type === "income" ? "bg-[#F4FFF7]" : "bg-[#FFF5F5]"
                }`}
              >
                {/* DESCRIPTION */}
                <td className="p-4">
                  <div className="text-sm font-medium text-[#2F2F36]">
                    {t.description}
                  </div>
                  {t.date && (
                    <div className="text-xs text-gray-500">
                      {new Date(t.date).toLocaleDateString("pt-BR")}
                    </div>
                  )}
                </td>

                {/* CATEGORY */}
                <td className="p-4 flex items-center gap-2">
                  <Tag size={14} className="text-gray-500" />
                  {t.category?.name ?? "Sem categoria"}
                </td>

                {/* VALUE */}
                <td className="p-4 font-semibold">
                  {formatCurrency(t.value)}
                </td>

                {/* TYPE */}
                <td className="p-4">
                  {t.type === "income" ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                      Entrada
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                      Saída
                    </span>
                  )}
                </td>

                {/* ORIGIN */}
                <td className="p-4">
                  {t.sheet_id ? (
                    <span className="px-3 py-1 rounded-full text-xs bg-[#E6F0FF] text-[#2F4A8A] border border-[#C3D7FF]">
                      Vinculada à Planilha #{t.sheet_id}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600 border border-gray-200">
                      Avulsa
                    </span>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="p-4">
                  <div className="flex justify-end gap-4">
                    <button
                      className="flex items-center gap-1 text-[#7B61FF] hover:underline text-sm"
                      onClick={() => openEditTransactionModal(t)}
                    >
                      <Pencil size={16} /> Editar
                    </button>

                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="flex items-center gap-1 text-red-600 hover:underline text-sm"
                    >
                      <Trash2 size={16} /> Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* TABLE 2 — SHEET ITEMS */}
      <div className="bg-white border rounded-3xl shadow-sm overflow-hidden border-[#E4E2F0]">
        <div className="flex items-center justify-between px-4 pt-4">
          <div>
            <h2 className="text-lg font-semibold text-[#2F2F36]">
              Transações de Planilhas (Módulo Planilhas)
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Entradas:{" "}
              <span className="font-semibold text-green-600">
                {formatCurrency(sheetIncomeFiltered)}
              </span>{" "}
              · Saídas:{" "}
              <span className="font-semibold text-red-600">
                {formatCurrency(sheetExpenseFiltered)}
              </span>
            </p>
          </div>
        </div>

        <table className="w-full mt-3">
          <thead className="bg-[#F6F4FF] text-[#4B4A54]">
            <tr>
              <th className="p-4 text-left">Descrição</th>
              <th className="p-4 text-left">Categoria</th>
              <th className="p-4 text-left">Valor</th>
              <th className="p-4 text-left">Tipo</th>
              <th className="p-4 text-left">Planilha</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>

          <tbody>
            {filteredSheetItems.map((s) => {
              const isIncome = s.type === "income";
              const isPaid = !!s.paid_at;
              const overdue = isOverdueSheetItem(s);

              // Same visual rule as the main Sheet screen:
              // income or paid -> soft green; expense open -> soft red.
              const rowColorClass =
                isIncome || isPaid ? "bg-[#E8F7EE]" : "bg-[#FCECEC]";

              const paidBadgeText = isPaid
                ? `Pago em ${formatDateToText(s.paid_at)}`
                : "";
              const overdueBadgeText =
                !isPaid && overdue
                  ? `Vencido em ${formatDateToText(s.date)}`
                  : "Vencido";

              const isUpdating = updatingSheetItemId === s.id;

              return (
                <tr
                  key={s.id}
                  className={`border-t border-[#F1EEF9] hover:bg-[#FAF8FF] transition ${rowColorClass}`}
                >
                  {/* DESCRIPTION + STATUS BADGES */}
                  <td className="p-4 align-top">
                    <div className="text-sm font-medium text-[#2F2F36]">
                      {s.description}
                    </div>
                    <div className="mt-1 space-y-1">
                      {s.date && (
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar size={12} className="text-gray-400" />
                          {new Date(s.date).toLocaleDateString("pt-BR")}
                        </div>
                      )}

                      {!isIncome && isPaid && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px]">
                          <CheckCircle2 size={11} />
                          <span>{paidBadgeText}</span>
                        </div>
                      )}

                      {!isIncome && !isPaid && overdue && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[11px]">
                          <AlertTriangle size={11} />
                          <span>{overdueBadgeText}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="p-4 flex items-center gap-2 align-top">
                    <Tag size={14} className="text-gray-500" />
                    {s.category?.name ?? "Sem categoria"}
                  </td>

                  {/* VALUE */}
                  <td className="p-4 font-semibold align-top">
                    {formatCurrency(s.value)}
                  </td>

                  {/* TYPE */}
                  <td className="p-4 align-top">
                    {s.type === "income" ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                        Entrada
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                        Saída
                      </span>
                    )}
                  </td>

                  {/* SHEET */}
                  <td className="p-4 align-top">
                    {s.sheet_id ? (
                      <span className="px-3 py-1 rounded-full text-xs bg-[#E6F0FF] text-[#2F4A8A] border border-[#C3D7FF]">
                        Planilha #{s.sheet_id}
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600 border border-gray-200">
                        Não informado
                      </span>
                    )}
                  </td>

                  {/* ACTIONS + PAYMENT INLINE */}
                  <td className="p-4 align-top">
                    <div className="flex justify-end gap-3 items-center flex-wrap">
                      {/* Pagamento inline – somente despesas */}
                      {s.type === "expense" && (
                        <div className="relative">
                          {!isPaid ? (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  setSheetPaidPopoverId((prev) =>
                                    prev === s.id ? null : s.id
                                  )
                                }
                                className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                              >
                                <CheckCircle2 size={12} />
                                Pagar
                                <ChevronDown size={12} />
                              </button>

                              {sheetPaidPopoverId === s.id && (
                                <div className="absolute right-0 mt-2 w-64 bg-white border border-emerald-100 rounded-2xl shadow-lg p-3 text-xs z-20">
                                  <p className="text-gray-600">
                                    Esta despesa será marcada como{" "}
                                    <span className="font-semibold text-emerald-700">
                                      paga hoje
                                    </span>{" "}
                                    ({formatDateToText(getTodayIso())}).
                                  </p>
                                  <div className="flex justify-end gap-2 mt-3">
                                    <button
                                      type="button"
                                      className="px-3 py-1 rounded-full border text-[11px] text-gray-500 hover:bg-gray-50"
                                      onClick={() =>
                                        setSheetPaidPopoverId(null)
                                      }
                                    >
                                      Cancelar
                                    </button>
                                    <button
                                      type="button"
                                      disabled={isUpdating}
                                      className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] hover:bg-emerald-700 flex items-center gap-1 disabled:opacity-60"
                                      onClick={() => {
                                        const today = getTodayIso();
                                        updateSheetItemPaidStatus(s, today);
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
                                  setSheetPaidPopoverId((prev) =>
                                    prev === s.id ? null : s.id
                                  )
                                }
                                className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                              >
                                <CheckCircle2 size={12} />
                                Pago em {formatDateToText(s.paid_at)}
                                <ChevronDown size={12} />
                              </button>

                              {sheetPaidPopoverId === s.id && (
                                <div className="absolute right-0 mt-2 w-64 bg-white border border-emerald-100 rounded-2xl shadow-lg p-3 text-xs z-20">
                                  <p className="text-gray-600">
                                    Este lançamento está marcado como{" "}
                                    <span className="font-semibold text-emerald-700">
                                      pago
                                    </span>{" "}
                                    em {formatDateToText(s.paid_at)}.
                                  </p>
                                  <div className="flex justify-end gap-2 mt-3">
                                    <button
                                      type="button"
                                      className="px-3 py-1 rounded-full border text-[11px] text-gray-500 hover:bg-gray-50"
                                      onClick={() =>
                                        setSheetPaidPopoverId(null)
                                      }
                                    >
                                      Fechar
                                    </button>
                                    <button
                                      type="button"
                                      disabled={isUpdating}
                                      className="px-3 py-1 rounded-full bg-red-500 text-white text-[11px] hover:bg-red-600 disabled:opacity-60"
                                      onClick={() =>
                                        updateSheetItemPaidStatus(s, null)
                                      }
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

                      <button
                        className="flex items-center gap-1 text-[#7B61FF] hover:underline text-sm"
                        onClick={() => openEditSheetItemModal(s)}
                      >
                        <Pencil size={16} /> Editar
                      </button>

                      <button
                        onClick={() => deleteSheetItem(s.id)}
                        className="flex items-center gap-1 text-red-600 hover:underline text-sm"
                      >
                        <Trash2 size={16} /> Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredSheetItems.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Nenhum item de planilha encontrado com os filtros atuais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white rounded-3xl w-[95%] max-w-lg p-6 shadow-xl border border-[#E6E1F7] animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {!editing
                  ? "Nova Transação"
                  : editing.kind === "transaction"
                  ? "Editar Transação"
                  : "Editar Item de Planilha"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
                  setForm({
                    description: "",
                    value: "",
                    type: "income",
                    category_id: "",
                    date: "",
                  });
                  setSaving(false);
                }}
                className="text-gray-500 hover:text-black"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* DESCRIPTION */}
              <div>
                <label className="text-sm text-gray-600">Descrição</label>
                <input
                  type="text"
                  className="border rounded-xl px-4 py-3 w-full"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              {/* VALUE */}
              <div>
                <label className="text-sm text-gray-600">Valor</label>
                <div className="flex items-center gap-2 border rounded-xl p-2">
                  <DollarSign className="text-gray-400" />
                  <input
                    type="number"
                    className="w-full bg-transparent outline-none"
                    value={form.value}
                    onChange={(e) =>
                      setForm({ ...form, value: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* TYPE */}
              <div>
                <label className="text-sm text-gray-600">Tipo</label>
                <select
                  className="border rounded-xl px-4 py-3 w-full"
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value as "income" | "expense",
                    })
                  }
                >
                  <option value="income">Entrada</option>
                  <option value="expense">Saída</option>
                </select>
              </div>

              {/* CATEGORY */}
              <div>
                <label className="text-sm text-gray-600">Categoria</label>
                <select
                  className="border rounded-xl px-4 py-3 w-full"
                  value={form.category_id}
                  onChange={(e) =>
                    setForm({ ...form, category_id: e.target.value })
                  }
                >
                  <option value="">Nenhuma</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* DATE */}
              <div>
                <label className="text-sm text-gray-600">Data</label>
                <div className="flex items-center gap-2 border rounded-xl p-2">
                  <Calendar className="text-gray-400" />
                  <input
                    type="date"
                    className="w-full bg-transparent outline-none"
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#7B61FF] text-white rounded-xl px-5 py-3 font-medium hover:bg-[#6A54E6] transition mt-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Salvando...
                  </>
                ) : !editing ? (
                  "Salvar"
                ) : editing.kind === "transaction" ? (
                  "Salvar transação"
                ) : (
                  "Salvar item de planilha"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
