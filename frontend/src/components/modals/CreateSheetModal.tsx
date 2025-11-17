// src/components/modals/CreateSheetModal.tsx
import { useState } from "react";
import { api } from "../../services/api";
import { X, Calendar, Coins, FileSpreadsheet, Info, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

interface Props {
  onClose: () => void;
  onCreated: (sheet: any) => void;
}

export function CreateSheetModal({ onClose, onCreated }: Props) {
  const now = new Date();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    month: String(now.getMonth() + 1),
    year: String(now.getFullYear()),
    initial_balance: "0",
  });

  async function handleCreate() {
    if (loading) return;

    if (!form.name.trim()) {
      Swal.fire("Aviso", "Informe o nome da planilha.", "warning");
      return;
    }

    if (!form.month || !form.year) {
      Swal.fire("Aviso", "Informe mês e ano.", "warning");
      return;
    }

    const payload = {
      name: form.name,
      description: form.description || null,
      month: Number(form.month),
      year: Number(form.year),
      initial_balance: Number(form.initial_balance || 0),
    };

    try {
      setLoading(true);

      const res = await api.post("/sheets", payload);

      if (!res.data.success) {
        Swal.fire(
          "Erro",
          res.data.message || "Não foi possível criar a planilha.",
          "error"
        );
        return;
      }

      onCreated(res.data.data);

      Swal.fire("Sucesso", "Planilha criada com sucesso!", "success");
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Não foi possível criar a planilha.";

      Swal.fire("Erro", msg, "error");
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
            <h2 className="text-xl font-semibold">Nova Planilha</h2>
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
          {/* Nome */}
          <div>
            <label className="text-sm text-gray-600">Nome</label>
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
              <Info className="text-gray-400" size={16} />
              <input
                type="text"
                className="w-full bg-transparent outline-none"
                placeholder="Ex: Planilha Janeiro/2025"
                value={form.name}
                disabled={loading}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="text-sm text-gray-600">Descrição</label>
            <textarea
              className="border rounded-xl px-3 py-2 w-full outline-none"
              placeholder="Detalhes opcionais sobre esta planilha..."
              value={form.description}
              disabled={loading}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          {/* Mês / Ano */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Mês</label>
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
                <Calendar className="text-gray-400" size={16} />
                <input
                  type="number"
                  min={1}
                  max={12}
                  className="w-full bg-transparent outline-none"
                  value={form.month}
                  disabled={loading}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, month: e.target.value }))
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Ano</label>
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
                <Calendar className="text-gray-400" size={16} />
                <input
                  type="number"
                  className="w-full bg-transparent outline-none"
                  value={form.year}
                  disabled={loading}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, year: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Saldo inicial */}
          <div>
            <label className="text-sm text-gray-600">Saldo inicial</label>
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
              <Coins className="text-[#7B61FF]" size={16} />
              <input
                type="number"
                className="w-full bg-transparent outline-none"
                value={form.initial_balance}
                disabled={loading}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    initial_balance: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleCreate}
            disabled={loading}
            className={`rounded-xl px-5 py-3 w-full mt-4 font-medium flex items-center justify-center gap-2
                ${
                  loading
                    ? "bg-[#7B61FF]/60 cursor-not-allowed"
                    : "bg-[#7B61FF] hover:bg-[#6A54E6]"
                } text-white transition`}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Criando...
              </>
            ) : (
              "Criar planilha"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
