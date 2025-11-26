import { useEffect, useState, useCallback } from "react";
import { api } from "../../../services/api";
import Swal from "sweetalert2";

import { normalizeSummary } from "../utils/summary";
import type { Sheet, SheetSummary } from "../types/sheet";

export function useSheets() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [summaries, setSummaries] = useState<Record<number, SheetSummary>>({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

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

  // ---------------------------------------------------------
  // CARREGAR PLANILHAS
  // ---------------------------------------------------------
  const loadSheets = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/sheets");

      // Laravel padrão → aceita {data: [...]} OU array direto
      const raw = res.data?.data ?? res.data;

      if (!Array.isArray(raw)) {
        Swal.fire("Erro", "Resposta inesperada do servidor.", "error");
        return;
      }

      const list: Sheet[] = raw.map((s: any) => ({
        ...s,
        initial_balance: Number(s.initial_balance),
      }));

      setSheets(list);

      if (!list.length) {
        setSummaries({});
        return;
      }

      // SUMMARIES
      const calls = list.map((s) => api.get(`/sheets/${s.id}/summary`));
      const results = await Promise.allSettled(calls);

      const map: Record<number, SheetSummary> = {};

      results.forEach((result, index) => {
        const sheet = list[index];
        if (result.status === "fulfilled") {
          const rawSummary = result.value?.data?.data ?? result.value?.data;
          map[sheet.id] = normalizeSummary(rawSummary, sheet.initial_balance);
        }
      });

      setSummaries(map);
    } catch (err) {
      Swal.fire("Erro", "Falha ao carregar planilhas.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------------------------------------------------------
  // ADICIONAR PLANILHA
  // ---------------------------------------------------------
  const addSheet = useCallback(async (sheet: Sheet) => {
    // Normaliza valores da planilha adicionada
    const normalized = {
      ...sheet,
      initial_balance: Number(sheet.initial_balance),
    };

    // Adiciona na lista
    setSheets((prev) => [...prev, normalized]);

    try {
      const res = await api.get(`/sheets/${sheet.id}/summary`);
      const rawSummary = res.data?.data ?? res.data;

      setSummaries((prev) => ({
        ...prev,
        [sheet.id]: normalizeSummary(rawSummary, Number(sheet.initial_balance)),
      }));
    } catch {
      setSummaries((prev) => ({
        ...prev,
        [sheet.id]: normalizeSummary({}, Number(sheet.initial_balance)),
      }));
    }
  }, []);

  // ---------------------------------------------------------
  // DELETAR PLANILHA
  // ---------------------------------------------------------
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
      await api.delete(`/sheets/${id}`);

      setSheets((prev) => prev.filter((s) => s.id !== id));

      setSummaries((prev) => {
        const clone = { ...prev };
        delete clone[id];
        return clone;
      });

      Swal.fire("Sucesso", "Planilha excluída", "success");
    } catch {
      Swal.fire("Erro", "Falha ao excluir a planilha", "error");
    }
  }, []);

  // ---------------------------------------------------------
  // FILTRAGEM
  // ---------------------------------------------------------
  const filteredSheets = useCallback(() => {
    let arr = [...sheets];

    if (search.trim() !== "") {
      const s = search.toLowerCase().trim();
      arr = arr.filter((sh) => sh.name.toLowerCase().includes(s));
    }

    arr.sort((a, b) => {
      const cmp = a.name.localeCompare(b.name);
      return sortAsc ? cmp : -cmp;
    });

    return arr;
  }, [sheets, search, sortAsc]);

  // ---------------------------------------------------------
  // ABRIR MODAL EDIÇÃO
  // ---------------------------------------------------------
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

  // ---------------------------------------------------------
  // SALVAR EDIÇÃO
  // ---------------------------------------------------------
  const saveEditSheet = useCallback(async () => {
    if (!editingSheet) return;

    const payload = {
      name: editForm.name,
      description: editForm.description,
      month: Number(editForm.month),
      year: Number(editForm.year),
      initial_balance: Number(editForm.initial_balance),
    };

    try {
      const res = await api.put(`/sheets/${editingSheet.id}`, payload);
      const updated = res.data?.data ?? res.data;

      setSheets((prev) =>
        prev.map((s) =>
          s.id === editingSheet.id
            ? {
                ...s,
                name: updated.name,
                description: updated.description,
                month: Number(updated.month),
                year: Number(updated.year),
                initial_balance: Number(updated.initial_balance),
              }
            : s
        )
      );

      try {
        const sum = await api.get(`/sheets/${editingSheet.id}/summary`);
        const raw = sum.data?.data ?? sum.data;

        setSummaries((prev) => ({
          ...prev,
          [editingSheet.id]: normalizeSummary(
            raw,
            Number(updated.initial_balance)
          ),
        }));
      } catch {}

      setEditModalOpen(false);
      Swal.fire("Sucesso", "Planilha atualizada!", "success");
    } catch (err: any) {
      Swal.fire(
        "Erro",
        err?.response?.data?.message || "Falha ao atualizar planilha",
        "error"
      );
    }
  }, [editingSheet, editForm]);

  // ---------------------------------------------------------
  // INICIAR CARREGAMENTO
  // ---------------------------------------------------------
  useEffect(() => {
    loadSheets();
  }, [loadSheets]);

  return {
    sheets,
    summaries,
    loading,

    search,
    setSearch,

    sortAsc,
    setSortAsc,

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
  };
}
