import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

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


  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, []);


  async function handleSave() {
    if (loading) return;
    setLoading(true);
    try {
      await onSave();
      onClose();
    } finally {
      setLoading(false);
    }
  }


  const Tooltip = ({ text }: { text: string }) => (
    <div
      className="
        absolute left-0 mt-1 px-3 py-1 rounded-lg text-xs z-[99999]
        bg-white dark:bg-[#1E1D25]
        text-[#2F2F36] dark:text-white/90
        border border-gray-300 dark:border-white/20
        shadow-lg whitespace-nowrap animate-fadeIn
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
              ? "Nome utilizado para identificar a planilha."
              : tipKey === "description"
              ? "Descrição opcional para organização interna."
              : tipKey === "month"
              ? "Informe o mês em formato numérico (1–12)."
              : tipKey === "year"
              ? "Informe o ano da planilha (ex: 2026)."
              : tipKey === "initial"
              ? "Saldo inicial disponível no início do mês."
              : ""
          }
        />
      )}
    </div>
  );


  return createPortal(
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/45 dark:bg-black/60 backdrop-blur-sm
        animate-fadeIn
      "
    >
      <div
        className="
          w-[90%] max-w-[520px]
          max-h-[92vh] overflow-y-auto custom-scroll
          rounded-[28px] p-6 md:p-8 shadow-xl animate-slideUp

          bg-gradient-to-br from-white/90 to-white/70
          dark:bg-gradient-to-br dark:from-[#1A1923]/90 dark:to-[#1A1923]/70

          border border-gray-200/60 dark:border-white/15
          backdrop-blur-xl relative
        "
      >

        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div
              className="
                p-3 rounded-2xl border shadow-sm
                bg-[#F5F2FF] dark:bg-[#2A2733]
                border-gray-200 dark:border-white/15
              "
            >
              <FileSpreadsheet
                size={22}
                className="text-[#7B61FF] dark:text-[#A99BFF]"
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#2F2F36] dark:text-white/90">
                Editar Planilha
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Atualize as informações e salve as alterações.
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
              value={form.description}
              disabled={loading}
              placeholder="Descrição opcional..."
              onChange={(v: string) => setForm({ ...form, description: v })}
            />
          </div>

  
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label text="Mês" tipKey="month" />
              <Input
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
              type="number"
              value={form.initial_balance}
              disabled={loading}
              icon={<Coins className="text-[#7B61FF] dark:text-[#A99BFF]" size={16} />}
              placeholder="Ex: 0"
              onChange={(v: string) =>
                setForm({ ...form, initial_balance: v })
              }
            />
          </div>

          {/* BOTÃO */}
          <button
            onClick={handleSave}
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
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
}
