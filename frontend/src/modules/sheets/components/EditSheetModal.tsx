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

import { Input } from "./Input";
import { Textarea } from "./Textarea";

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

export function EditSheetModal({
  form,
  setForm,
  onClose,
  onSave,
}: EditModalProps) {
  const [loading, setLoading] = useState(false);
  const [hoverTip, setHoverTip] = useState<string | null>(null);

  async function handleSave() {
    if (loading) return;
    setLoading(true);
    try {
      await onSave();
    } finally {
      setLoading(false);
    }
  }

  const Tooltip = ({ text }: { text: string }) => (
    <div
      className="
        absolute left-0 mt-1 px-3 py-1 rounded-lg text-xs z-40
        bg-light-card dark:bg-dark-card
        text-light-text dark:text-dark-text
        border border-light-border dark:border-dark-border
        shadow-md whitespace-nowrap animate-fadeIn
      "
    >
      {text}
    </div>
  );

  const Label = ({
    text,
    tipKey,
  }: {
    text: string;
    tipKey: string;
  }) => (
    <div className="flex items-center gap-1 mb-1 relative">
      <span className="text-sm font-semibold text-light-text dark:text-dark-text">
        {text}
      </span>

      <HelpCircle
        size={15}
        className="text-[#7B61FF] cursor-pointer"
        onMouseEnter={() => setHoverTip(tipKey)}
        onMouseLeave={() => setHoverTip(null)}
      />

      {hoverTip === tipKey && (
        <Tooltip
          text={
            tipKey === "name"
              ? "Nome utilizado para identificar a planilha."
              : tipKey === "description"
              ? "Descrição opcional para organizar melhor sua gestão."
              : tipKey === "month"
              ? "Informe o mês no formato numérico, ex: 11."
              : tipKey === "year"
              ? "Informe o ano da planilha, ex: 2025."
              : tipKey === "initial"
              ? "Valor inicial no início do mês."
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
        bg-black/40 dark:bg-black/60 backdrop-blur-sm
        animate-fadeIn
      "
    >
      <div
        className="
          w-[95%] max-w-xl max-h-[90vh] overflow-y-auto p-8 rounded-[32px]
          relative shadow-xl animate-slideUp

          bg-gradient-to-br from-light-card/90 to-light-card/70
          dark:bg-gradient-to-br dark:from-dark-card/90 dark:to-dark-card/70

          border border-light-border/60 dark:border-dark-border/40
          backdrop-blur-xl
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div
              className="
                p-3 rounded-2xl border shadow-sm
                bg-pastel-lilac dark:bg-dark-card2
                border-light-border dark:border-dark-border
              "
            >
              <FileSpreadsheet size={22} className="text-[#7B61FF]" />
            </div>

            <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text">
              Editar Planilha
            </h2>
          </div>

          <button
            onClick={onClose}
            className="
              p-2 rounded-xl transition
              text-gray-600 dark:text-gray-300
              hover:bg-black/10 dark:hover:bg-white/10
            "
            disabled={loading}
          >
            <X size={22} />
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-7">
          <div>
            <Label text="Nome" tipKey="name" />
            <Input
              label=""
              value={form.name}
              disabled={loading}
              icon={<Info className="text-gray-400 dark:text-gray-300" size={16} />}
              placeholder="Ex: Controle Financeiro"
              onChange={(v: string) => setForm({ ...form, name: v })}
            />
          </div>

          <div>
            <Label text="Descrição" tipKey="description" />
            <Textarea
              label=""
              value={form.description}
              disabled={loading}
              placeholder="Descrição opcional..."
              onChange={(v: string) => setForm({ ...form, description: v })}
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
                icon={<Calendar className="text-gray-400 dark:text-gray-300" size={16} />}
                placeholder="Ex: 11"
                onChange={(v: string) => setForm({ ...form, month: v })}
              />
            </div>

            <div>
              <Label text="Ano" tipKey="year" />
              <Input
                label=""
                type="number"
                value={form.year}
                disabled={loading}
                icon={<Calendar className="text-gray-400 dark:text-gray-300" size={16} />}
                placeholder="Ex: 2025"
                onChange={(v: string) => setForm({ ...form, year: v })}
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
              icon={<Coins className="text-[#7B61FF]" size={16} />}
              placeholder="Ex: 0"
              onChange={(v: string) =>
                setForm({ ...form, initial_balance: v })
              }
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="
              mt-6 w-full px-5 py-4 rounded-2xl font-medium
              flex items-center justify-center gap-3
              text-white transition-all active:scale-[0.97] disabled:opacity-60

              bg-gradient-to-r from-[#7B61FF] to-[#6A54E6]
              hover:shadow-lg hover:shadow-[#7B61FF]/25
            "
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}
