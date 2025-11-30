import {
  X,
  Coins,
  DollarSign,
  Calendar,
  Landmark,
  CheckCircle2,
  HelpCircle,
  Loader2,
} from "lucide-react";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getCategoryIcon } from "../utils/categoryIcons";

import type { Category, Bank, ItemFormState, ItemType } from "../types/sheet";

interface Props {
  mode: "create" | "edit";
  form: ItemFormState;
  setForm: (f: ItemFormState) => void;
  categories: Category[];
  banks: Bank[];
  onClose: () => void;
  onSave: () => Promise<void> | void;
  saving: boolean;
}

export function ItemModal({
  mode,
  form,
  setForm,
  categories,
  banks,
  onClose,
  onSave,
  saving,
}: Props) {
  const title = mode === "create" ? "Novo item" : "Editar item";
  const [hoverTip, setHoverTip] = useState<string | null>(null);


  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

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
    label,
    tip,
    tipKey,
  }: {
    label: string;
    tip: string;
    tipKey: string;
  }) => (
    <div className="flex items-center gap-1 mb-1 relative">
      <span className="text-sm font-semibold text-[#2F2F36] dark:text-white/90">
        {label}
      </span>

      <HelpCircle
        size={15}
        className="text-[#7B61FF] dark:text-[#A99BFF] cursor-pointer"
        onMouseEnter={() => setHoverTip(tipKey)}
        onMouseLeave={() => setHoverTip(null)}
      />

      {hoverTip === tipKey && <Tooltip text={tip} />}
    </div>
  );

  return createPortal(
    <div
      className="
        fixed inset-0 z-[9999]
        bg-black/50 dark:bg-black/70 backdrop-blur-sm
        flex items-center justify-center
        animate-fadeIn
      "
    >
      <div
        className="
          w-[90%] max-w-[520px]
          max-h-[92vh] overflow-y-auto custom-scroll
          rounded-[28px] p-6 md:p-8 relative animate-slideUp

          bg-gradient-to-br from-white/90 to-white/70
          dark:bg-gradient-to-br dark:from-[#1A1923]/90 dark:to-[#1A1923]/70

          border border-gray-200/60 dark:border-white/15
          shadow-xl backdrop-blur-xl
        "
      >

        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div
              className="
                p-3 rounded-2xl shadow-sm border
                bg-[#F5F2FF] dark:bg-[#2A2733]
                border-gray-200 dark:border-white/15
              "
            >
              {form.type === "income" ? (
                <Coins size={24} className="text-green-600 dark:text-green-400" />
              ) : (
                <Coins size={24} className="text-red-600 dark:text-red-400" />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#2F2F36] dark:text-white/90">
                {title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Preencha os dados da movimentação financeira.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={saving}
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
            <Label label="Tipo" tip="Escolha entrada ou saída." tipKey="type" />

            <div
              className="
                flex items-center gap-3 px-4 py-3 rounded-2xl shadow-sm
                bg-white dark:bg-[#2A2733]
                border border-gray-300 dark:border-white/15
                focus-within:ring-2 focus-within:ring-[#7B61FF]
              "
            >
              <Coins
                size={20}
                className={
                  form.type === "income"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }
              />

              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value as ItemType,
                    paid_at: e.target.value === "income" ? "" : form.paid_at,
                  })
                }
                className="
                  w-full outline-none bg-transparent text-sm
                  text-[#2F2F36] dark:text-white/90
                "
              >
                <option value="income">Entrada</option>
                <option value="expense">Saída</option>
              </select>
            </div>
          </div>

  
          <div>
            <Label label="Valor" tip="Informe o valor correspondente." tipKey="value" />

            <div
              className="
                flex items-center gap-3 px-4 py-3 rounded-2xl shadow-sm
                bg-white dark:bg-[#2A2733]
                border border-gray-300 dark:border-white/15
                focus-within:ring-2 focus-within:ring-[#7B61FF]
              "
            >
              <DollarSign size={20} className="text-gray-400 dark:text-gray-300" />

              <input
                type="number"
                className="
                  w-full bg-transparent outline-none text-sm
                  text-[#2F2F36] dark:text-white/90
                "
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
            </div>
          </div>

  
          <div>
            <Label
              label="Categoria"
              tip="Escolha uma categoria."
              tipKey="category"
            />

            <div
              className="
                flex items-center gap-3 px-4 py-3 shadow-sm rounded-2xl
                bg-white dark:bg-[#2A2733]
                border border-gray-300 dark:border-white/15
                focus-within:ring-2 focus-within:ring-[#7B61FF]
              "
            >
              {(() => {
                const selected = categories.find(
                  (c) => String(c.id) === form.category_id
                );
                const Icon = getCategoryIcon(selected);
                return (
                  <Icon size={20} className="text-gray-500 dark:text-gray-300" />
                );
              })()}

              <select
                className="
                  w-full outline-none bg-transparent text-sm
                  text-[#2F2F36] dark:text-white/90
                "
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
              >
                <option value="">Sem categoria</option>
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>


          <div>
            <Label
              label="Banco"
              tip="Selecione o banco relacionado."
              tipKey="bank"
            />

            <div
              className="
                flex items-center gap-3 px-4 py-3 shadow-sm rounded-2xl
                bg-white dark:bg-[#2A2733]
                border border-gray-300 dark:border-white/15
                focus-within:ring-2 focus-within:ring-[#7B61FF]
              "
            >
              <Landmark size={20} className="text-gray-500 dark:text-gray-300" />

              <select
                className="
                  w-full outline-none bg-transparent text-sm
                  text-[#2F2F36] dark:text-white/90
                "
                value={form.bank_id}
                onChange={(e) =>
                  setForm({ ...form, bank_id: e.target.value })
                }
              >
                <option value="">Sem banco</option>
                {banks.map((b) => (
                  <option key={b.id} value={String(b.id)}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

      
          <div>
            <Label
              label="Data"
              tip="Quando essa movimentação ocorreu?"
              tipKey="date"
            />

            <div
              className="
                flex items-center gap-3 px-4 py-3 shadow-sm rounded-2xl
                bg-white dark:bg-[#2A2733]
                border border-gray-300 dark:border-white/15
                focus-within:ring-2 focus-within:ring-[#7B61FF]
              "
            >
              <Calendar size={20} className="text-gray-500 dark:text-gray-300" />

              <input
                type="date"
                className="
                  w-full bg-transparent outline-none text-sm
                  text-[#2F2F36] dark:text-white/90
                "
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
              />
            </div>
          </div>

      
          {form.type === "expense" && (
            <div>
              <Label
                label="Pago em"
                tip="Quando a despesa foi paga?"
                tipKey="paid_at"
              />

              <div
                className="
                  flex items-center gap-3 px-4 py-3 shadow-sm rounded-2xl
                  bg-white dark:bg-[#2A2733]
                  border border-gray-300 dark:border-white/15
                  focus-within:ring-2 focus-within:ring-[#7B61FF]
                "
              >
                <CheckCircle2 size={20} className="text-gray-500 dark:text-gray-300" />

                <input
                  type="date"
                  className="
                    w-full bg-transparent outline-none text-sm
                    text-[#2F2F36] dark:text-white/90
                  "
                  value={form.paid_at}
                  onChange={(e) =>
                    setForm({ ...form, paid_at: e.target.value })
                  }
                />
              </div>
            </div>
          )}

     
          <div>
            <Label
              label="Descrição"
              tip="Informações adicionais do item."
              tipKey="description2"
            />

            <textarea
              className="
                w-full min-h-[90px] p-3 text-sm rounded-2xl shadow-sm resize-none
                bg-white dark:bg-[#2A2733]
                text-[#2F2F36] dark:text-white/90
                border border-gray-300 dark:border-white/15
                focus:ring-2 focus:ring-[#7B61FF]
              "
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

   
          <button
            onClick={onSave}
            disabled={saving}
            className="
              mt-4 w-full px-5 py-4 rounded-2xl font-medium text-white
              flex items-center justify-center gap-3
              transition-all active:scale-[0.97] disabled:opacity-60
              bg-gradient-to-r from-[#7B61FF] to-[#6A54E6]
              hover:shadow-lg hover:shadow-[#7B61FF]/25
            "
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Salvando...
              </>
            ) : mode === "create" ? (
              "Adicionar item"
            ) : (
              "Salvar alterações"
            )}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
}
