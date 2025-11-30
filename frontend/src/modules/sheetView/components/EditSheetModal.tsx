import {
  X,
  Coins,
  Loader2,
  HelpCircle,
  Info,
  Calendar,
} from "lucide-react";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
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
  saving: boolean;
}

export function EditSheetModal({
  form,
  setForm,
  onClose,
  onSave,
  saving,
}: Props) {
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
        bg-light-card dark:bg-dark-card
        text-light-text dark:text-dark-text
        border border-light-border dark:border-dark-border
        shadow-lg whitespace-nowrap animate-fadeIn
      "
    >
      {text}
    </div>
  );

  const Label = ({
    text,
    tip,
    tipKey,
  }: {
    text: string;
    tip: string;
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

      {hoverTip === tipKey && <Tooltip text={tip} />}
    </div>
  );


  return createPortal(
    <div
      className="
        fixed inset-0 z-[9999]
        bg-black/40 dark:bg-black/60 backdrop-blur-sm
        flex items-center justify-center
        animate-fadeIn
      "
    >
      <div
        className="
          w-[90%] max-w-[520px]
          max-h-[92vh] overflow-y-auto custom-scroll
          rounded-[28px] p-6 md:p-8 relative animate-slideUp

          bg-gradient-to-br from-light-card/90 to-light-card/70
          dark:bg-gradient-to-br dark:from-dark-card/90 dark:to-dark-card/70

          border border-light-border/60 dark:border-dark-border/40
          shadow-xl backdrop-blur-xl
        "
      >
 
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div
              className="
                p-3 rounded-2xl shadow-sm border
                bg-pastel-lilac dark:bg-dark-card2
                border-light-border dark:border-dark-border
              "
            >
              <Coins size={26} className="text-[#7B61FF]" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text">
                Editar Planilha
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Atualize as informações desta planilha.
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
            <Label
              text="Nome"
              tip="Nome que será exibido na lista de planilhas."
              tipKey="name"
            />

            <div
              className="
                flex items-center gap-3 px-4 py-3 rounded-2xl shadow-sm
                bg-light-card dark:bg-dark-input
                border border-light-border dark:border-dark-border
                focus-within:ring-2 focus-within:ring-[#7B61FF]
              "
            >
              <Info size={18} className="text-gray-400 dark:text-gray-300" />

              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="
                  w-full bg-transparent outline-none text-sm
                  text-light-text dark:text-dark-text
                "
              />
            </div>
          </div>

 
          <div>
            <Label
              text="Descrição"
              tip="Texto opcional para identificar ou detalhar a planilha."
              tipKey="description"
            />

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="
                w-full min-h-[90px] resize-none p-3 text-sm rounded-2xl shadow-sm
                bg-light-card dark:bg-dark-input
                text-light-text dark:text-dark-text
                border border-light-border dark:border-dark-border
                focus:ring-2 focus:ring-[#7B61FF]
              "
            />
          </div>

      
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label
                text="Mês"
                tip="Informe o mês (1 a 12)."
                tipKey="month"
              />

              <div
                className="
                  flex items-center gap-3 px-4 py-3 rounded-2xl shadow-sm
                  bg-light-card dark:bg-dark-input
                  border border-light-border dark:border-dark-border
                  focus-within:ring-2 focus-within:ring-[#7B61FF]
                "
              >
                <Calendar
                  size={18}
                  className="text-gray-400 dark:text-gray-300"
                />

                <input
                  type="number"
                  value={form.month}
                  onChange={(e) =>
                    setForm({ ...form, month: e.target.value })
                  }
                  className="
                    w-full bg-transparent outline-none text-sm
                    text-light-text dark:text-dark-text
                  "
                />
              </div>
            </div>

            <div>
              <Label
                text="Ano"
                tip="Informe o ano completo, ex: 2026."
                tipKey="year"
              />

              <div
                className="
                  flex items-center gap-3 px-4 py-3 rounded-2xl shadow-sm
                  bg-light-card dark:bg-dark-input
                  border border-light-border dark:border-dark-border
                  focus-within:ring-2 focus-within:ring-[#7B61FF]
                "
              >
                <Calendar
                  size={18}
                  className="text-gray-400 dark:text-gray-300"
                />

                <input
                  type="number"
                  value={form.year}
                  onChange={(e) =>
                    setForm({ ...form, year: e.target.value })
                  }
                  className="
                    w-full bg-transparent outline-none text-sm
                    text-light-text dark:text-dark-text
                  "
                />
              </div>
            </div>
          </div>

       
          <div>
            <Label
              text="Saldo Inicial"
              tip="Valor disponível no começo do mês."
              tipKey="initial"
            />

            <div
              className="
                flex items-center gap-3 px-4 py-3 rounded-2xl shadow-sm
                bg-light-card dark:bg-dark-input
                border border-light-border dark:border-dark-border
                focus-within:ring-2 focus-within:ring-[#7B61FF]
              "
            >
              <Coins size={18} className="text-[#7B61FF]" />

              <input
                type="number"
                value={form.initial_balance}
                onChange={(e) =>
                  setForm({
                    ...form,
                    initial_balance: e.target.value,
                  })
                }
                className="
                  w-full bg-transparent outline-none text-sm
                  text-light-text dark:text-dark-text
                "
              />
            </div>
          </div>


          <button
            onClick={onSave}
            disabled={saving}
            className="
              w-full mt-4 px-5 py-4 rounded-2xl font-medium text-white
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
