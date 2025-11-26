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

import { useState } from "react";
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
    label,
    tip,
    tipKey,
  }: {
    label: string;
    tip: string;
    tipKey: string;
  }) => (
    <div className="flex items-center gap-1 mb-1 relative">
      <span className="text-sm font-semibold text-light-text dark:text-dark-text">
        {label}
      </span>

      <HelpCircle
        size={15}
        className="text-[#7B61FF] cursor-pointer"
        onMouseEnter={() => setHoverTip(tipKey)}
        onMouseLeave={() => setHoverTip(null)}
      />

      {hoverTip === tipKey && <Tooltip text={tip} />}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="
          w-[95%] max-w-lg max-h-[90vh] overflow-y-auto
          rounded-[32px] p-8 relative animate-slideUp
          bg-gradient-to-br from-light-card/90 to-light-card/70
          dark:bg-gradient-to-br dark:from-dark-card/90 dark:to-dark-card/70
          border border-light-border/60 dark:border-dark-border/40
          shadow-xl backdrop-blur-xl
        "
      >

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div
              className="
                p-3 rounded-2xl shadow-sm border
                bg-pastel-lilac dark:bg-dark-card2
                border-light-border dark:border-dark-border
              "
            >
              {form.type === "income" ? (
                <Coins size={24} className="text-green-600" />
              ) : (
                <Coins size={24} className="text-red-600" />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text">
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

        {/* FORM */}
        <div className="space-y-7">

          {/* Tipo */}
          <div>
            <Label
              label="Tipo"
              tip="Escolha se é entrada ou saída."
              tipKey="type"
            />

            <div
              className="
                flex items-center gap-3 px-4 py-3 shadow-sm rounded-2xl
                bg-light-card dark:bg-dark-input
                border border-light-border dark:border-dark-border
                focus-within:ring-2 focus-within:ring-[#7B61FF]
              "
            >
              <Coins
                size={20}
                className={
                  form.type === "income" ? "text-green-600" : "text-red-600"
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
                className="w-full outline-none bg-transparent text-sm text-light-text dark:text-dark-text"
              >
                <option value="income">Entrada</option>
                <option value="expense">Saída</option>
              </select>
            </div>
          </div>

          {/* Valor */}
          <div>
            <Label
              label="Valor"
              tip="Informe o valor do item."
              tipKey="value"
            />

            <div
              className="
                flex items-center gap-3 px-4 py-3 rounded-2xl shadow-sm
                bg-light-card dark:bg-dark-input
                border border-light-border dark:border-dark-border
                focus-within:ring-2 focus-within:ring-[#7B61FF]
              "
            >
              <DollarSign size={20} className="text-gray-400 dark:text-gray-300" />

              <input
                type="number"
                className="w-full bg-transparent outline-none text-sm text-light-text dark:text-dark-text"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
            </div>
          </div>

          {/* Categoria */}
          <div>
            <Label
              label="Categoria"
              tip="Escolha uma categoria para organizar o item."
              tipKey="category"
            />

            <div
              className="
                flex items-center gap-3 px-4 py-3 shadow-sm rounded-2xl
                bg-light-card dark:bg-dark-input
                border border-light-border dark:border-dark-border
                focus-within:ring-2 focus-within:ring-[#7B61FF]
              "
            >
              {(() => {
                const selected = categories.find(
                  (c) => String(c.id) === form.category_id
                );
                const Icon = getCategoryIcon(selected);
                return <Icon size={20} className="text-gray-500 dark:text-gray-300" />;
              })()}

              <select
                className="w-full outline-none bg-transparent text-sm text-light-text dark:text-dark-text"
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

          {/* Banco */}
          <div>
            <Label
              label="Banco"
              tip="Selecione o banco relacionado à movimentação."
              tipKey="bank"
            />

            <div
              className="
                flex items-center gap-3 px-4 py-3 shadow-sm rounded-2xl
                bg-light-card dark:bg-dark-input
                border border-light-border dark:border-dark-border
                focus-within:ring-2 focus-within:ring-[#7B61FF]
              "
            >
              <Landmark size={20} className="text-gray-500 dark:text-gray-300" />

              <select
                className="
                  w-full outline-none bg-transparent text-sm
                  text-light-text dark:text-dark-text
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

          {/* Data */}
          <div>
            <Label
              label="Data"
              tip="Data em que a movimentação ocorreu."
              tipKey="date"
            />

            <div
              className="
                flex items-center gap-3 px-4 py-3 shadow-sm rounded-2xl
                bg-light-card dark:bg-dark-input
                border border-light-border dark:border-dark-border
                focus-within:ring-2 focus-within:ring-[#7B61FF]
              "
            >
              <Calendar size={20} className="text-gray-500 dark:text-gray-300" />

              <input
                type="date"
                className="w-full bg-transparent outline-none text-sm text-light-text dark:text-dark-text"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
              />
            </div>
          </div>

          {/* Pago em (somente para saídas) */}
          {form.type === "expense" && (
            <div>
              <Label
                label="Pago em"
                tip="Data em que o pagamento foi efetuado."
                tipKey="paid_at"
              />

              <div
                className="
                  flex items-center gap-3 px-4 py-3 shadow-sm rounded-2xl
                  bg-light-card dark:bg-dark-input
                  border border-light-border dark:border-dark-border
                  focus-within:ring-2 focus-within:ring-[#7B61FF]
                "
              >
                <CheckCircle2 size={20} className="text-gray-500 dark:text-gray-300" />

                <input
                  type="date"
                  className="
                    w-full bg-transparent outline-none text-sm
                    text-light-text dark:text-dark-text
                  "
                  value={form.paid_at}
                  onChange={(e) =>
                    setForm({ ...form, paid_at: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* Descrição */}
          <div>
            <Label
              label="Descrição"
              tip="Texto opcional para detalhamento da movimentação."
              tipKey="description"
            />

            <textarea
              className="
                w-full block min-h-[90px] p-3 text-sm rounded-2xl shadow-sm resize-none
                bg-light-card dark:bg-dark-input
                text-light-text dark:text-dark-text
                border border-light-border dark:border-dark-border
                focus:ring-2 focus:ring-[#7B61FF]
              "
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* BUTTON */}
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
    </div>
  );
}
