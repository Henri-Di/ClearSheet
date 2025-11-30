import { useEffect, useState, useCallback, useMemo } from "react";
import Swal from "sweetalert2";
import { api } from "../../../services/api";
import { normalizeSummary } from "../utils/summary";
import type { Sheet, SheetSummary } from "../types/sheet";

function extractData<T = unknown>(response: any): T {
  if (response?.data?.data !== undefined) return response.data.data as T;
  if (response?.data !== undefined) return response.data as T;
  return response as T;
}

function showError(message: string) {
  Swal.fire("Erro", message, "error");
}

function showSuccess(message: string) {
  Swal.fire("Sucesso", message, "success");
}

export function useSheets() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [summaries, setSummaries] = useState<Record<number, SheetSummary>>({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"name" | "month" | "year" | "date" | "balance">("name");
  const [sortAsc, setSortAsc] = useState(true);

  const [filterMonth, setFilterMonth] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>("");
  const [filterMinBalance, setFilterMinBalance] = useState<string>("");
  const [filterMaxBalance, setFilterMaxBalance] = useState<string>("");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [editingSheet, setEditingSheet] = useState<Sheet | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    month: "",
    year: "",
    initial_balance: "",
  });

  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchSummary = useCallback(async (sheet: Sheet): Promise<[number, SheetSummary]> => {
    try {
      const res = await api.get(`/sheets/${sheet.id}/summary`);
      const raw = extractData<any>(res);
      return [sheet.id, normalizeSummary(raw, Number(sheet.initial_balance))];
    } catch {
      return [sheet.id, normalizeSummary({}, Number(sheet.initial_balance))];
    }
  }, []);

  const loadSheets = useCallback(async () => {
    setLoading(true);
    let cancelled = false;

    try {
      const res = await api.get("/sheets");
      const raw = extractData<any[]>(res);

      if (!Array.isArray(raw)) {
        showError("Resposta inesperada do servidor.");
        return;
      }

      const list: Sheet[] = raw.map((s) => ({
        ...s,
        initial_balance: Number(s.initial_balance),
        month: Number(s.month),
        year: Number(s.year),
      }));

      if (cancelled) return;
      setSheets(list);

      if (!list.length) {
        setSummaries({});
        return;
      }

      const entries = await Promise.all(list.map((s) => fetchSummary(s)));
      if (cancelled) return;

      const summaryMap: Record<number, SheetSummary> = {};
      for (const [id, summary] of entries) summaryMap[id] = summary;

      setSummaries(summaryMap);
    } catch {
      if (!cancelled) showError("Falha ao carregar planilhas.");
    } finally {
      if (!cancelled) setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [fetchSummary]);

  const addSheet = useCallback(
    async (sheet: Sheet) => {
      const normalized = {
        ...sheet,
        initial_balance: Number(sheet.initial_balance),
        month: Number(sheet.month),
        year: Number(sheet.year),
      };

      setSheets((prev) => [...prev, normalized]);

      const [, summary] = await fetchSummary(normalized);

      setSummaries((prev) => ({
        ...prev,
        [normalized.id]: summary,
      }));
    },
    [fetchSummary]
  );

  const deleteSheet = useCallback(async (id: number) => {
    const confirmation = await Swal.fire({
      title: "Excluir Planilha?",
      text: "Esta ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Excluir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#E02424",
    });

    if (!confirmation.isConfirmed) return;

    try {
      setDeletingId(id);
      await api.delete(`/sheets/${id}`);

      setSheets((prev) => prev.filter((s) => s.id !== id));

      setSummaries((prev) => {
        const clone = { ...prev };
        delete clone[id];
        return clone;
      });

      showSuccess("Planilha excluída.");
    } catch {
      showError("Falha ao excluir a planilha.");
    } finally {
      setDeletingId(null);
    }
  }, []);

  const filteredSheetsMemo = useMemo(() => {
    let arr = [...sheets];

    const term = search.trim().toLowerCase();
    if (term) {
      arr = arr.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          (s.description || "").toLowerCase().includes(term)
      );
    }

    if (filterMonth) arr = arr.filter((s) => String(s.month) === String(filterMonth));
    if (filterYear) arr = arr.filter((s) => String(s.year) === String(filterYear));

    if (filterMinBalance) {
      const min = Number(filterMinBalance);
      arr = arr.filter((s) => Number(s.initial_balance) >= min);
    }

    if (filterMaxBalance) {
      const max = Number(filterMaxBalance);
      arr = arr.filter((s) => Number(s.initial_balance) <= max);
    }

    arr.sort((a, b) => {
      let cmp = 0;

      if (sortField === "name") cmp = a.name.localeCompare(b.name);
      if (sortField === "month") cmp = a.month - b.month;
      if (sortField === "year") cmp = a.year - b.year;
      if (sortField === "balance") cmp = a.initial_balance - b.initial_balance;
      if (sortField === "date") cmp = a.year !== b.year ? a.year - b.year : a.month - b.month;

      return sortAsc ? cmp : -cmp;
    });

    return arr;
  }, [
    sheets,
    search,
    sortField,
    sortAsc,
    filterMonth,
    filterYear,
    filterMinBalance,
    filterMaxBalance,
  ]);

  const filteredSheets = useCallback(() => filteredSheetsMemo, [filteredSheetsMemo]);

  function openEditModal(sheet: Sheet) {
    setEditingSheet(sheet);
    setEditForm({
      name: sheet.name,
      description: sheet.description || "",
      month: String(sheet.month),
      year: String(sheet.year),
      initial_balance: String(sheet.initial_balance),
    });
    setEditModalOpen(true);
  }

  const saveEditSheet = useCallback(async () => {
    if (!editingSheet) return;

    const payload = {
      name: editForm.name.trim(),
      description: editForm.description.trim(),
      month: Number(editForm.month),
      year: Number(editForm.year),
      initial_balance: Number(editForm.initial_balance),
    };

    if (!payload.name) {
      showError("Informe o nome da planilha.");
      return;
    }
    if (!payload.month || !payload.year) {
      showError("Informe mês e ano.");
      return;
    }

    try {
      setSavingEdit(true);

      const res = await api.put(`/sheets/${editingSheet.id}`, payload);
      const updated = extractData<Sheet>(res);

      const normalizedUpdated = {
        ...editingSheet,
        ...updated,
        month: Number(updated.month),
        year: Number(updated.year),
        initial_balance: Number(updated.initial_balance),
      };

      setSheets((prev) =>
        prev.map((s) => (s.id === editingSheet.id ? normalizedUpdated : s))
      );

      const [, summary] = await fetchSummary(normalizedUpdated);
      setSummaries((prev) => ({
        ...prev,
        [editingSheet.id]: summary,
      }));

      setEditModalOpen(false);
      setEditingSheet(null);
      showSuccess("Planilha atualizada!");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Falha ao atualizar planilha.";
      showError(msg);
    } finally {
      setSavingEdit(false);
    }
  }, [editingSheet, editForm, fetchSummary]);

  useEffect(() => {
    loadSheets();
  }, [loadSheets]);

  return {
    sheets,
    summaries,
    loading,

    search,
    setSearch,

    sortField,
    setSortField,

    sortAsc,
    setSortAsc,

    filterMonth,
    setFilterMonth,

    filterYear,
    setFilterYear,

    filterMinBalance,
    setFilterMinBalance,

    filterMaxBalance,
    setFilterMaxBalance,

    createModalOpen,
    setCreateModalOpen,

    editModalOpen,
    setEditModalOpen,

    editForm,
    setEditForm,

    filteredSheets,

    deleteSheet,
    openEditModal,
    saveEditSheet,
    addSheet,
    loadSheets,

    savingEdit,
    deletingId,
    editingSheet,
  };
}
