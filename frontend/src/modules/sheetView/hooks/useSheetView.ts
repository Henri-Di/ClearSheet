

import { useEffect, useMemo, useState } from "react";
import { api } from "../../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { normalize, formatDateToText } from "../utils/normalize";
import { formatCurrency } from "../utils/currency";

import {
  getCategoryIconByCode,
  getCategoryIconComponent,
} from "../utils/categoryIcons";

import { apiItemToUnified } from "../utils/apiMapper";

import type {
  Sheet,
  Category,
  Bank,
  UnifiedItem,
  ItemFormState,
  SortDirection,
  SortField,
} from "../types/sheet";


const EMPTY_FORM: ItemFormState = {
  type: "income",
  value: "",
  category_id: "",
  bank_id: "",
  description: "",
  date: "",
  paid_at: "",
};


function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}



function checkOverdue(item: UnifiedItem): boolean {
  if (!item.date) return false;
  if (item.type === "income") return false;
  if (item.paid_at) return false;

  return item.date < todayIso();
}


export function useSheetView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [sheetItems, setSheetItems] = useState<UnifiedItem[] | null>(null);
  const [transactionItems, setTransactionItems] = useState<UnifiedItem[] | null>(null);

  const [banks, setBanks] = useState<Bank[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);

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
  const [updatingInlineKey, setUpdatingInlineKey] = useState<string | null>(null);

  const [savingItem, setSavingItem] = useState(false);
  const [savingSheet, setSavingSheet] = useState(false);

  const [originalDueDates, setOriginalDueDates] = useState<Record<string, string | null>>({});


  async function loadData() {
    if (!id) return;

    try {
      setLoading(true);

      const [sheetRes, sheetItemsRes, transRes, banksRes, catRes] =
        await Promise.all([
          api.get(`/sheets/${id}`),
          api.get(`/sheets/${id}/items`),
          api.get(`/transactions?sheet_id=${id}`),
          api.get(`/banks`),
          api.get(`/categories`),
        ]);

      const sheetData = sheetRes.data?.data ?? sheetRes.data;

      setSheet({
        ...sheetData,
        initial_balance: Number(sheetData.initial_balance ?? 0),
      });

      setSheetItems(
        (sheetItemsRes.data?.data || sheetItemsRes.data || []).map(apiItemToUnified)
      );

      setTransactionItems(
        (transRes.data?.data || transRes.data || []).map((raw: any) =>
          apiItemToUnified({
            ...raw,
            origin: "transaction",
            sheet_id: null,
          })
        )
      );

      setBanks(
        (banksRes.data?.data || banksRes.data || []).map((b: any) => ({
          id: b.id,
          name: b.name,
        }))
      );

      setCategories(
        (catRes.data?.data || catRes.data || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          icon: c.icon ?? null,
        }))
      );
    } catch {
      Swal.fire("Erro", "Erro ao carregar dados.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);


  const allItems = useMemo(() => {
    if (!sheetItems || !transactionItems) return null;
    return [...sheetItems, ...transactionItems];
  }, [sheetItems, transactionItems]);


  const filtered = useMemo(() => {
    if (!allItems) return null;

    const term = normalize(search);

    const list = allItems.filter((i) => {
      if (!term) return true;

      const fields = [
        normalize(i.description || ""),
        normalize(i.category?.name || ""),
        normalize(i.bank?.name || ""),
        normalize(String(i.value)),
        normalize(i.type),
        normalize(i.origin),
        normalize(i.paid_at ? "pago" : "nao pago"),
      ];

      return fields.some((f) => f.includes(term));
    });

    const dir = direction === "asc" ? 1 : -1;

    return list.sort((a, b) => {
      let A: any;
      let B: any;

      switch (sortField) {
        case "value":
          A = Number(a.value);
          B = Number(b.value);
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

        default:
          A = a.date || "";
          B = b.date || "";
      }

      if (A < B) return -1 * dir;
      if (A > B) return 1 * dir;
      return 0;
    });
  }, [allItems, search, sortField, direction]);


  const entradas = filtered
    ? filtered.filter((i) => i.type === "income").reduce((s, i) => s + Number(i.value), 0)
    : 0;

  const saidas = filtered
    ? filtered.filter((i) => i.type === "expense").reduce((s, i) => s + Number(i.value), 0)
    : 0;

  const saldoFinal = sheet
    ? Number(sheet.initial_balance) + entradas - saidas
    : 0;


  function updateLocalItemField(
    item: UnifiedItem,
    field: keyof UnifiedItem,
    value: any
  ) {
    const fn = (prev: UnifiedItem[] | null) =>
      prev
        ? prev.map((i) =>
            i.id === item.id && i.origin === item.origin
              ? { ...i, [field]: value }
              : i
          )
        : prev;

    if (item.origin === "sheet") setSheetItems(fn);
    else setTransactionItems(fn);
  }


  async function updateInline(
    item: UnifiedItem,
    field: keyof UnifiedItem,
    value: any
  ) {
    const key = `${item.origin}-${item.id}`;

    try {
      setUpdatingInlineKey(key);

      const endpoint =
        item.origin === "sheet"
          ? `/sheets/${sheet?.id}/items/${item.id}`
          : `/transactions/${item.id}`;


      if (field === "paid_at") {
        const newPaid = value || null;

        if (newPaid && !originalDueDates[key]) {
          setOriginalDueDates((p) => ({ ...p, [key]: item.date ?? null }));
        }

        const restored =
          newPaid === null ? originalDueDates[key] ?? item.date : item.date;

        updateLocalItemField(item, "paid_at", newPaid);
        updateLocalItemField(item, "date", restored);

        const res = await api.put(endpoint, {
          paid_at: newPaid,
          date: restored,
        });

        const server = res.data?.data ?? {};

        const updated: UnifiedItem = {
          ...item,
          ...server,
          paid_at: newPaid,
          date: restored,
          raw: { ...item.raw, ...server },
        };

        const apply = (prev: UnifiedItem[] | null) =>
          prev
            ? prev.map((i) =>
                i.id === updated.id && i.origin === updated.origin
                  ? updated
                  : i
              )
            : prev;

        if (item.origin === "sheet") setSheetItems(apply);
        else setTransactionItems(apply);

        return;
      }


      const res = await api.put(endpoint, { [field]: value });
      const server = res.data?.data ?? {};

      const updated: UnifiedItem = {
        ...item,
        ...server,
        [field]: value,
        raw: { ...item.raw, ...server },
      };

      const apply = (prev: UnifiedItem[] | null) =>
        prev
          ? prev.map((i) =>
              i.id === updated.id && i.origin === updated.origin
                ? updated
                : i
            )
          : prev;

      if (item.origin === "sheet") setSheetItems(apply);
      else setTransactionItems(apply);
    } finally {
      setUpdatingInlineKey(null);
      setLastUpdatedKey(key);
      setTimeout(() => setLastUpdatedKey(null), 1500);
    }
  }


async function deleteInline(item: UnifiedItem) {
  const endpoint =
    item.origin === "sheet"
      ? `/sheets/${sheet?.id}/items/${item.id}`
      : `/transactions/${item.id}`;

  await api.delete(endpoint);

  const remove = (prev: UnifiedItem[] | null) =>
    prev ? prev.filter((i) => i.id !== item.id) : prev;

  if (item.origin === "sheet") setSheetItems(remove);
  else setTransactionItems(remove);

  Swal.fire({
    icon: "success",
    title: "Removido",
    text: "O item foi excluído.",
    timer: 1400,
    showConfirmButton: false,
    customClass: { popup: "swal-pastel-popup" },
  });
}


  async function deleteSheet() {
    if (!sheet) return;

    const c = await Swal.fire({
      title: "Excluir planilha?",
      text: "Essa ação é permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Excluir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#E02424",
    });

    if (!c.isConfirmed) return;

    await api.delete(`/sheets/${sheet.id}`);

    Swal.fire("Pronto", "Planilha removida.", "success");
    navigate("/sheets");
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
      type: item.origin === "transaction" ? "expense" : item.type,
      value: String(item.value),
      category_id: item.category_id ? String(item.category_id) : "",
      bank_id: item.bank_id ? String(item.bank_id) : "",
      description: item.description || "",
      date: item.date || "",
      paid_at: item.paid_at || "",
    });

    setShowItemModal(true);
  }

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


  async function saveItemFromModal() {
    if (!sheet || savingItem) return;

    const payload: any = {
      type: itemForm.type,
      value: Number(itemForm.value ?? 0),
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
        const res = await api.post(`/sheets/${sheet.id}/items`, payload);

        let unified = apiItemToUnified(res.data?.data);
        unified.origin = "sheet";
        unified.sheet_id = sheet.id;

        unified = {
          ...unified,
          category: categories?.find((c) => c.id === unified.category_id) || null,
          bank: banks?.find((b) => b.id === unified.bank_id) || null,
        };

        setSheetItems((prev) => (prev ? [...prev, unified] : [unified]));

        Swal.fire("Adicionado", "Item criado com sucesso.", "success");
      }

 
      else if (editingItem) {
        const endpoint =
          editingItem.origin === "sheet"
            ? `/sheets/${sheet.id}/items/${editingItem.id}`
            : `/transactions/${editingItem.id}`;

        const res = await api.put(endpoint, payload);

        let updated = apiItemToUnified(
          res.data?.data || { ...editingItem.raw, ...payload }
        );

        updated.origin = editingItem.origin;
        updated.sheet_id =
          editingItem.origin === "sheet" ? sheet.id : null;

        updated = {
          ...updated,
          category:
            categories?.find((c) => c.id === updated.category_id) || null,
          bank: banks?.find((b) => b.id === updated.bank_id) || null,
        };

        const apply = (prev: UnifiedItem[] | null) =>
          prev
            ? prev.map((i) =>
                i.id === updated.id && i.origin === updated.origin
                  ? updated
                  : i
              )
            : prev;

        if (editingItem.origin === "sheet") setSheetItems(apply);
        else setTransactionItems(apply);

        Swal.fire("Salvo", "Item atualizado.", "success");
      }

      setShowItemModal(false);
      setEditingItem(null);
      setModalMode("create");
      setItemForm(EMPTY_FORM);
    } catch {
      Swal.fire("Erro", "Erro ao salvar item.", "error");
    } finally {
      setSavingItem(false);
    }
  }


  async function saveSheet() {
    if (!sheet || savingSheet) return;

    try {
      setSavingSheet(true);

      const payload = {
        name: sheetForm.name,
        description: sheetForm.description,
        month: Number(sheetForm.month ?? 0),
        year: Number(sheetForm.year ?? 0),
        initial_balance: Number(sheetForm.initial_balance ?? 0),
      };

      const res = await api.put(`/sheets/${sheet.id}`, payload);

      const updated = res.data?.data ?? payload;

      setSheet({
        ...sheet,
        ...updated,
        initial_balance: Number(updated.initial_balance ?? 0),
      });

      setShowSheetModal(false);

      Swal.fire("Salvo", "Planilha atualizada.", "success");
    } catch {
      Swal.fire("Erro", "Erro ao atualizar planilha.", "error");
    } finally {
      setSavingSheet(false);
    }
  }
  
  return {
    sheet,
    sheetItems,
    transactionItems,
    banks,
    categories,
    loading,

    itemForm,
    setItemForm,

    sheetForm,
    setSheetForm,

    showItemModal,
    setShowItemModal,

    showSheetModal,
    setShowSheetModal,

    modalMode,
    editingItem,

    search,
    setSearch,

    sortField,
    setSortField,
    direction,
    setDirection,
    sortMenuOpen,
    setSortMenuOpen,

    lastUpdatedKey,
    updatingInlineKey,

    savingItem,
    savingSheet,

    filtered,
    entradas,
    saidas,
    saldoFinal,

    updateLocalItemField,
    updateInline,
    deleteInline,
    deleteSheet,

    openCreateItemModal,
    openEditItemModal,
    openEditSheetModal,

    saveItemFromModal,
    saveSheet,

    formatDateToText,
    formatCurrency,
    todayIso,
    checkOverdue,

    getTodayIso: todayIso,
    isOverdue: checkOverdue,

    getCategoryIconByCode,
    getCategoryIconComponent,
  };
}
