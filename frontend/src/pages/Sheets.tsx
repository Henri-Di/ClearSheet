// src/pages/Sheets.tsx
import { useEffect, useState, type JSX } from "react";
import { api } from "../services/api";

import {
  FileSpreadsheet,
  Plus,
  Pencil,
  Trash2,
  ArrowUpDown,
  Search,
  Calendar,
  Coins,
  Info,
  ArrowRight,
  X,
  Loader2,
} from "lucide-react";

import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { CreateSheetModal } from "../components/modals/CreateSheetModal";

/* ============================================================================
 * GLOBAL TOAST SYSTEM (MESMO PADRÃO DE TRANSACTIONS)
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

export function showSuccessToast(title: string, text?: string) {
  baseToast.fire({ icon: "success", title, text });
}

export function showErrorToast(title: string, text?: string) {
  baseToast.fire({ icon: "error", title, text });
}

export function showWarningToast(title: string, text?: string) {
  baseToast.fire({ icon: "warning", title, text });
}

// ==========================================================
// TYPES
// ==========================================================

interface Sheet {
  id: number;
  name: string;
  description?: string | null;
  month: number;
  year: number;
  initial_balance: number;
}

interface SheetSummary {
  entradas: number;
  saidas: number;
  initial: number;
  saldo_final: number;
}

// ==========================================================
// HELPERS
// ==========================================================

function normalizeSummary(raw: any, fallbackInitial: number): SheetSummary {
  const entradas = Number(raw?.entradas ?? raw?.income ?? 0);
  const saidas = Number(raw?.saidas ?? raw?.expense ?? 0);
  const initial = Number(
    raw?.initial ?? raw?.initial_balance ?? fallbackInitial ?? 0
  );
  const saldo_final = Number(
    raw?.saldo_final ?? raw?.balance ?? initial + entradas - saidas
  );

  return { entradas, saidas, initial, saldo_final };
}

/** User-friendly currency formatter (BRL). */
function formatCurrency(value: number | null | undefined) {
  if (value == null || isNaN(Number(value))) return "R$ 0,00";
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

// ==========================================================
// PAGE
// ==========================================================

export default function Sheets() {
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

  // ========================================================
  // LOAD SHEETS + SUMMARIES
  // ========================================================

  async function loadSheets() {
    let normalized: Sheet[] = [];

    try {
      setLoading(true);
      const res = await api.get("/sheets");

      if (!res.data.success) {
        showErrorToast("Erro ao carregar planilhas", res.data.message);
        setSheets([]);
        return;
      }

      normalized = res.data.data.map((s: any) => ({
        ...s,
        initial_balance: Number(s.initial_balance),
      }));

      setSheets(normalized);
    } catch {
      showErrorToast("Erro ao carregar planilhas", "Falha ao carregar planilhas.");
      setSheets([]);
    } finally {
      setLoading(false);
    }

    if (!normalized.length) return;

    try {
      const calls = normalized.map((sheet) =>
        api.get(`/sheets/${sheet.id}/summary`)
      );

      const results = await Promise.all(calls);

      const map: Record<number, SheetSummary> = {};
      results.forEach((r, idx) => {
        const sid = normalized[idx].id;
        const raw = r.data?.data ?? r.data;
        map[sid] = normalizeSummary(raw, normalized[idx].initial_balance);
      });

      setSummaries(map);
    } catch {
      // Falha de resumo não deve quebrar a tela
      // Apenas log silencioso / console se quiser
      console.warn("Falha ao carregar summaries");
    }
  }

  // ========================================================
  // DELETE SHEET (MESMA CONFIRMAÇÃO VISUAL DE TRANSACTIONS)
  // ========================================================

  async function deleteSheet(id: number) {
    const confirmation = await Swal.fire({
      title: "Excluir Planilha?",
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

    if (!confirmation.isConfirmed) return;

    try {
      await api.delete(`/sheets/${id}`);

      setSheets((prev) => prev.filter((s) => s.id !== id));
      setSummaries((prev) => {
        const clone = { ...prev };
        delete clone[id];
        return clone;
      });

      showSuccessToast("Planilha excluída");
    } catch {
      showErrorToast("Erro ao excluir planilha", "Falha ao excluir a planilha.");
    }
  }

  // ========================================================
  // FILTER + SORT
  // ========================================================

  function filteredSheets() {
    return sheets
      .filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) =>
        sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      );
  }

  // ========================================================
  // EDIT SHEET (MODAL)
  // ========================================================

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

  async function saveEditSheet() {
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
      const updated = res.data.data;

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
        const sumRes = await api.get(`/sheets/${editingSheet.id}/summary`);
        const raw = sumRes.data?.data ?? sumRes.data;
        const normalized = normalizeSummary(
          raw,
          Number(updated.initial_balance)
        );

        setSummaries((prev) => ({
          ...prev,
          [editingSheet.id]: normalized,
        }));
      } catch {
        console.warn("Falha ao atualizar summary após edição");
      }

      setEditModalOpen(false);
      showSuccessToast("Planilha atualizada!");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Falha ao atualizar a planilha.";
      showErrorToast("Erro ao atualizar planilha", msg);
    }
  }

  useEffect(() => {
    loadSheets();
  }, []);

  // ========================================================
  // VIEW
  // ========================================================

  return (
    <div className="animate-fadeIn space-y-10 pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl font-semibold text-[#2F2F36] tracking-tight">
          Planilhas
        </h1>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-[#7B61FF] text-white px-5 py-3 rounded-xl font-medium
                     flex items-center gap-2 hover:bg-[#6A54E6]
                     transition shadow-sm hover:shadow-md"
        >
          <Plus size={18} />
          Nova Planilha
        </button>
      </div>

      {/* SEARCH + SORT */}
      <div className="bg-white border rounded-3xl p-6 shadow-sm border-[#E4E2F0] mb-10 flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1 bg-[#FBFAFF] border border-[#E0DEED] rounded-xl px-4 py-3">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Buscar planilhas..."
            className="flex-1 bg-transparent focus:outline-none text-[#3A3A45]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={() => setSortAsc((prev) => !prev)}
          className="flex items-center gap-2 text-[#7B61FF] font-medium
                     bg-[#F0ECFF] border border-[#E3DEFF] px-4 py-3 rounded-xl
                     hover:bg-[#E7E0FF] transition"
        >
          <ArrowUpDown size={16} />
          Ordenar
        </button>
      </div>

      {/* LOADER */}
      {loading && (
        <div className="space-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-[#EAE7F6] rounded-3xl p-6 shadow-sm animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#F3F0FF] rounded-2xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-48 bg-[#EEE9FA] rounded-xl" />
                  <div className="h-3 w-32 bg-[#EEE9FA] rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIST */}
      {!loading && (
        <div className="flex flex-col gap-6">
          {filteredSheets().map((sheet) => (
            <SheetCard
              key={sheet.id}
              sheet={sheet}
              summary={summaries[sheet.id]}
              onDelete={() => deleteSheet(sheet.id)}
              onEdit={() => openEditModal(sheet)}
            />
          ))}

          {filteredSheets().length === 0 && (
            <p className="text-sm text-gray-500 text-center mt-10">
              Nenhuma planilha encontrada.
            </p>
          )}
        </div>
      )}

      {/* MODAL CRIAR */}
      {createModalOpen && (
        <CreateSheetModal
          onClose={() => setCreateModalOpen(false)}
          onCreated={(sheet: any) => {
            const normalized: Sheet = {
              ...sheet,
              initial_balance: Number(sheet.initial_balance),
            };

            setSheets((prev) => [...prev, normalized]);

            setSummaries((prev) => ({
              ...prev,
              [normalized.id]: {
                entradas: 0,
                saidas: 0,
                initial: normalized.initial_balance,
                saldo_final: normalized.initial_balance,
              },
            }));

            showSuccessToast("Planilha criada");
          }}
        />
      )}

      {/* MODAL EDITAR */}
      {editModalOpen && (
        <EditSheetModal
          form={editForm}
          setForm={setEditForm}
          onClose={() => setEditModalOpen(false)}
          onSave={saveEditSheet}
        />
      )}
    </div>
  );
}

// ==========================================================
// SHEET CARD
// ==========================================================

interface CardProps {
  sheet: Sheet;
  summary?: SheetSummary;
  onDelete: () => void;
  onEdit: () => void;
}

function SheetCard({ sheet, summary, onDelete, onEdit }: CardProps) {
  const entradas = Number(summary?.entradas ?? 0);
  const saidas = Number(summary?.saidas ?? 0);
  const initial = Number(summary?.initial ?? sheet.initial_balance);
  const final = Number(summary?.saldo_final ?? initial + entradas - saidas);

  return (
    <div
      className="bg-white border border-[#E6E1F7] rounded-3xl p-6 shadow-sm
                 hover:shadow-md hover:-translate-y-1 transition"
    >
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <Link to={`/sheets/${sheet.id}`} className="flex-1">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white border border-[#EEEAFB] shadow-sm">
              <FileSpreadsheet size={28} className="text-[#7B61FF]" />
            </div>

            <div>
              <h3 className="font-display text-xl text-[#2F2F36]">
                {sheet.name}
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {sheet.month}/{sheet.year}
                </span>
                {sheet.description && (
                  <span className="flex items-center gap-1 text-gray-500">
                    <Info size={14} />
                    <span className="text-xs opacity-70">
                      {sheet.description.slice(0, 22)}...
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 text-[#7B61FF] hover:underline"
          >
            <Pencil size={16} />
            Editar
          </button>

          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 text-red-600 hover:underline"
          >
            <Trash2 size={16} />
            Excluir
          </button>
        </div>
      </div>

      {/* SUMMARY BOXES */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
        <InfoBox
          title="Saldo Inicial"
          value={initial}
          color="#E76BA3"
          border="#F4D6E3"
          icon={<Coins className="text-[#E76BA3]" />}
        />
        <InfoBox
          title="Entradas"
          value={entradas}
          color="green"
          border="#E6E1F7"
          icon={<Coins className="text-green-600" />}
        />
        <InfoBox
          title="Saídas"
          value={saidas}
          color="red"
          border="#E6E1F7"
          icon={<Coins className="text-red-600" />}
        />
        <InfoBox
          title="Saldo Final"
          value={final}
          color="#7B61FF"
          border="#E6E1F7"
          icon={<ArrowRight className="text-[#7B61FF]" />}
        />
      </div>
    </div>
  );
}

function InfoBox({
  title,
  value,
  color,
  border,
  icon,
}: {
  title: string;
  value: number;
  color: string;
  border: string;
  icon: JSX.Element;
}) {
  return (
    <div
      className="bg-white border rounded-2xl p-4 shadow-sm"
      style={{ borderColor: border }}
    >
      <div className="flex items-center justify-between">
        <span className="text-gray-600 text-sm">{title}</span>
        {icon}
      </div>
      <p className="text-lg font-semibold mt-1" style={{ color }}>
        {formatCurrency(value)}
      </p>
    </div>
  );
}

// ==========================================================
// EDIT SHEET MODAL
// ==========================================================

interface EditModalProps {
  form: {
    name: string;
    description: string;
    month: string;
    year: string;
    initial_balance: string;
  };
  setForm: (f: any) => void;
  onClose: () => void;
  onSave: () => Promise<void> | void;
}

function EditSheetModal({ form, setForm, onClose, onSave }: EditModalProps) {
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (loading) return;
    setLoading(true);
    try {
      await onSave();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl w-[95%] max-w-xl p-6 shadow-lg border border-[#E6E1F7] animate-fadeIn">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#F3F0FF] border border-[#E0DCFF]">
              <FileSpreadsheet size={20} className="text-[#7B61FF]" />
            </div>
            <h2 className="text-xl font-semibold">Editar Planilha</h2>
          </div>

          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black"
            disabled={loading}
          >
            <X size={22} />
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          <Input
            label="Nome"
            value={form.name}
            disabled={loading}
            icon={<Info className="text-gray-400" size={16} />}
            placeholder="Nome da planilha"
            onChange={(v: string) => setForm({ ...form, name: v })}
          />

          <Textarea
            label="Descrição"
            value={form.description}
            disabled={loading}
            placeholder="Detalhes opcionais sobre esta planilha..."
            onChange={(v: string) => setForm({ ...form, description: v })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Mês"
              type="number"
              value={form.month}
              disabled={loading}
              icon={<Calendar className="text-gray-400" size={16} />}
              onChange={(v: string) => setForm({ ...form, month: v })}
            />
            <Input
              label="Ano"
              type="number"
              value={form.year}
              disabled={loading}
              icon={<Calendar className="text-gray-400" size={16} />}
              onChange={(v: string) => setForm({ ...form, year: v })}
            />
          </div>

          <Input
            label="Saldo inicial"
            type="number"
            value={form.initial_balance}
            disabled={loading}
            icon={<Coins className="text-[#7B61FF]" size={16} />}
            onChange={(v: string) =>
              setForm({ ...form, initial_balance: v })
            }
          />

          <button
            onClick={handleSave}
            disabled={loading}
            className={`rounded-xl px-5 py-3 w-full mt-4 font-medium flex items-center justify-center gap-2
                ${
                  loading
                    ? "bg-[#7B61FF]/70 cursor-not-allowed"
                    : "bg-[#7B61FF] hover:bg-[#6A54E6]"
                } text-white transition`}
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================================
// FORM FIELDS
// ==========================================================

interface InputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  icon?: JSX.Element;
  disabled?: boolean;
  placeholder?: string;
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  icon,
  disabled = false,
  placeholder,
}: InputProps) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
        {icon}
        <input
          type={type}
          className="w-full bg-transparent outline-none"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

interface TextareaProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

function Textarea({
  label,
  value,
  onChange,
  disabled = false,
  placeholder,
}: TextareaProps) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <textarea
        className="border rounded-xl px-3 py-2 w-full outline-none"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
