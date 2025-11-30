import { useState } from "react";
import {
  X,
  FileSpreadsheet,
  Info,
  Calendar,
  Coins,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { api } from "../../../services/api";
import Swal from "sweetalert2";

import { Input } from "./Input";
import { Textarea } from "./Textarea";

interface Props {
  onClose: () => void;
  onCreated: (sheet: any) => void;
}

export function CreateSheetModal({ onClose, onCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const [hoverTip, setHoverTip] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    month: "",
    year: "",
    initial_balance: "",
  });

  async function handleCreate() {
    if (loading) return;

    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        month: Number(form.month),
        year: Number(form.year),
        initial_balance: Number(form.initial_balance),
      };

      const res = await api.post("/sheets", payload);
      const data = res.data?.data ?? res.data;

      if (!data || !data.id) throw new Error("Resposta inesperada.");

      onCreated(data);

      Swal.fire({
        title: "Planilha criada!",
        text: "Sua nova planilha foi adicionada com sucesso.",
        icon: "success",
        confirmButtonColor: "#7B61FF",
      });

      onClose();
    } catch (err: any) {
      let msg = "Erro ao criar planilha.";

      if (err?.response?.data?.errors) {
        msg = Object.values(err.response.data.errors).flat().join("\n");
      } else if (err?.response?.data?.message) {
        msg = err.response.data.message;
      }

      Swal.fire({
        title: "Erro",
        text: msg,
        icon: "error",
        confirmButtonColor: "#7B61FF",
      });
    } finally {
      setLoading(false);
    }
  }


  const Tooltip = ({ text }: { text: string }) => (
    <div
      className="
        absolute left-0 mt-1 px-3 py-1 rounded-lg text-xs z-40
        bg-white dark:bg-[#1E1D25]
        text-[#2F2F36] dark:text-white/90
        border border-gray-300 dark:border-white/20
        shadow-lg whitespace-nowrap animate-fadeIn
      "
    >
      {text}
    </div>
  );


  const Label = ({ text, tipKey }: { text: string; tipKey: string }) => (
    <div className="flex items-center gap-1 relative mb-1">
      <span className="text-sm font-semibold text-[#2F2F36] dark:text-white/90">
        {text}
      </span>

      <HelpCircle
        size={15}
        className="text-[#7B61FF] dark:text-[#A99BFF] cursor-pointer"
        onMouseEnter={() => setHoverTip(tipKey)}
        onMouseLeave={() => setHoverTip(null)}
      />

      {hoverTip === tipKey && (
        <Tooltip
          text={
            tipKey === "name"
              ? "Escolha um nome claro para identificar a planilha."
              : tipKey === "description"
              ? "Descrição opcional para organização interna."
              : tipKey === "month"
              ? "Informe o mês (1–12)."
              : tipKey === "year"
              ? "Ano da planilha (ex: 2026)."
              : tipKey === "initial"
              ? "Saldo inicial do mês."
              : ""
          }
        />
      )}
    </div>
  );


  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center justify-center
        animate-fadeIn bg-black/45 dark:bg-black/60 backdrop-blur-sm
      "
    >
      <div
        className="
          w-[95%] max-w-xl max-h-[90vh] overflow-y-auto rounded-[32px] p-8 relative
          shadow-xl animate-slideUp

          bg-gradient-to-br from-white/90 to-white/70
          dark:bg-gradient-to-br dark:from-[#1A1923]/90 dark:to-[#1A1923]/70

          border border-gray-200/60 dark:border-white/15
          backdrop-blur-xl
        "
      >

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">

            <div
              className="
                p-3 rounded-2xl border shadow-sm
                bg-[#F5F2FF] dark:bg-[#2A2733]
                border-gray-200 dark:border-white/15
              "
            >
              <FileSpreadsheet
                size={24}
                className="text-[#7B61FF] dark:text-[#A99BFF]"
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#2F2F36] dark:text-white/90">
                Criar nova planilha
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Preencha as informações para criar sua nova planilha.
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="
              p-2 rounded-xl transition
              text-gray-600 dark:text-gray-300
              hover:bg-black/10 dark:hover:bg-white/10
            "
          >
            <X size={22} />
          </button>
        </div>

        <div className="space-y-7">

      
          <div>
            <Label text="Nome" tipKey="name" />
            <Input
              label=""
              value={form.name}
              disabled={loading}
              icon={<Info size={16} className="text-gray-400 dark:text-gray-300" />}
              placeholder="Ex: Controle Financeiro Novembro"
              onChange={(v) => setForm({ ...form, name: v })}
            />
          </div>

      
          <div>
            <Label text="Descrição" tipKey="description" />
            <Textarea
              label=""
              value={form.description}
              disabled={loading}
              placeholder="Descrição opcional..."
              onChange={(v) => setForm({ ...form, description: v })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label text="Mês" tipKey="month" />
              <Input
                label=""
                type="number"
                value={form.month}
                disabled={loading}
                icon={<Calendar size={16} className="text-gray-400 dark:text-gray-300" />}
                placeholder="Ex: 11"
                onChange={(v) => setForm({ ...form, month: v })}
              />
            </div>

            <div>
              <Label text="Ano" tipKey="year" />
              <Input
                label=""
                type="number"
                value={form.year}
                disabled={loading}
                icon={<Calendar size={16} className="text-gray-400 dark:text-gray-300" />}
                placeholder="Ex: 2025"
                onChange={(v) => setForm({ ...form, year: v })}
              />
            </div>
          </div>

         
          <div>
            <Label text="Saldo Inicial" tipKey="initial" />
            <Input
              label=""
              type="number"
              value={form.initial_balance}
              disabled={loading}
              icon={<Coins size={16} className="text-[#7B61FF] dark:text-[#A99BFF]" />}
              placeholder="Ex: 0"
              onChange={(v) => setForm({ ...form, initial_balance: v })}
            />
          </div>

      
          <button
            onClick={handleCreate}
            disabled={loading}
            className="
              mt-6 w-full px-5 py-4 rounded-2xl font-medium text-white
              flex items-center justify-center gap-3
              transition-all active:scale-[0.97] disabled:opacity-60

              bg-gradient-to-r from-[#7B61FF] to-[#6A54E6]
              hover:shadow-lg hover:shadow-[#7B61FF]/25
            "
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Criando..." : "Criar Planilha"}
          </button>
        </div>
      </div>
    </div>
  );
}
