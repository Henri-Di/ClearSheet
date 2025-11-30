import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Pencil,
  Trash2,
  Landmark,
  DollarSign,
  Calendar,
  HelpCircle,
} from "lucide-react";

import Swal from "sweetalert2";
import "../style/swal-pastel.css";

import { formatDateToText } from "../utils/normalize";
import {
  getCategoryIconByCode,
  getCategoryIconComponent,
} from "../utils/categoryIcons";

import type { UnifiedItem, Category, Bank } from "../types/sheet";
import type { EditableItemField } from "../types/editable";
import type { JSX } from "react/jsx-runtime";
import { useState } from "react";


/* ----------------------------------------------------------
    FIX: Converte para ISO curto e preserva integridade
---------------------------------------------------------- */
const normalizeDate = (v: any): string | null =>
  v ? String(v).slice(0, 10) : null;

const addOneDay = (iso: string | null): string | null => {
  if (!iso) return null;
  const d = new Date(iso);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

const isItemOverdue = (item: UnifiedItem): boolean => {
  if (item.type === "income") return false;
  if (!item.date) return false;
  if (item.paid_at) return false;
  return String(item.date).slice(0, 10) < new Date().toISOString().slice(0, 10);
};


/* ----------------------------------------------------------
    Tooltip com contraste reforçado
---------------------------------------------------------- */
function Tooltip({ text }: { text: string }) {
  return (
    <div
      className="
        absolute top-full left-0 mt-1 px-3 py-2 rounded-xl text-xs z-[9999]
        backdrop-blur-xl shadow-lg border whitespace-nowrap

        bg-[#FFFFFFF0] text-[#1a1a1a] border-[#E6E1F7]
        dark:bg-[#1A1523F0] dark:text-gray-100 dark:border-[#3a2e52]

        transition-colors
      "
    >
      {text}
    </div>
  );
}


/* ----------------------------------------------------------
    ITEM ROW
---------------------------------------------------------- */
interface Props {
  item: UnifiedItem;
  index: number;
  banks: Bank[];
  categories: Category[];
  updatingInlineKey: string | null;
  lastUpdatedKey?: string | null;

  updateLocalItemField: (
    item: UnifiedItem,
    field: EditableItemField,
    value: any
  ) => void;

  updateInline: (
    item: UnifiedItem,
    field: EditableItemField,
    value: any
  ) => Promise<void>;

  deleteInline: (item: UnifiedItem) => Promise<void>;
  openEditItemModal: (item: UnifiedItem) => void;
  getTodayIso: () => string;
}


/* ----------------------------------------------------------
    COMPONENTE PRINCIPAL
---------------------------------------------------------- */
export function ItemRow({
  item,
  index,
  banks,
  categories,
  updatingInlineKey,
  updateLocalItemField,
  updateInline,
  deleteInline,
  openEditItemModal,
  getTodayIso,
}: Props) {
  const overdue = isItemOverdue(item);
  const isIncome = item.type === "income";
  const isPaid = !!item.paid_at;
  const isUpdating = updatingInlineKey === `${item.origin}-${item.id}`;


  /* ------------------------------------------------------
      SPINNER INLINE — não quebra padding/margins
  ------------------------------------------------------ */
  const Spinner = () => (
    <div className="flex items-center justify-center">
      <div
        className="
          w-7 h-7 border-[3px]
          border-[#9d8aff] border-t-transparent
          rounded-full animate-spin
        "
      ></div>
    </div>
  );


  /* ------------------------------------------------------
      ÍCONE DE CATEGORIA
  ------------------------------------------------------ */
  const CatIcon =
    item.category?.icon
      ? getCategoryIconByCode(item.category.icon)
      : getCategoryIconComponent(item.category?.name || "");


  /* ------------------------------------------------------
      BADGES DE STATUS COM CONTRASTE OTIMIZADO
  ------------------------------------------------------ */
  let badgeBg = "";
  let badgeText = "";
  let badgeIcon: JSX.Element | null = null;

  if (isIncome) {
    badgeBg =
      "bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm dark:bg-emerald-900/40 dark:text-emerald-100 dark:border-emerald-700";
    badgeText = "Receita";
    badgeIcon = <TrendingUp size={14} className="mr-1" />;
  } else if (isPaid) {
    badgeBg =
      "bg-emerald-200 text-emerald-900 border border-emerald-300 shadow-sm dark:bg-emerald-800/40 dark:text-emerald-100 dark:border-emerald-700";
    badgeText = "Pago";
    badgeIcon = <CheckCircle2 size={14} className="mr-1" />;
  } else if (overdue) {
    badgeBg =
      "bg-red-200 text-red-900 border border-red-300 shadow-sm dark:bg-red-900/40 dark:text-red-100 dark:border-red-700";
    badgeText = "Atrasado";
    badgeIcon = <AlertTriangle size={14} className="mr-1" />;
  } else {
    badgeBg =
      "bg-red-100 text-red-700 border border-red-300 shadow-sm dark:bg-red-900/30 dark:text-red-200 dark:border-red-700";
    badgeText = "Despesa";
    badgeIcon = <TrendingDown size={14} className="mr-1" />;
  }


  /* ------------------------------------------------------
      ROW BACKGROUND (OTIMIZADO L/D)
  ------------------------------------------------------ */
  const rowBg =
    isPaid
      ? "bg-emerald-50/40 dark:bg-emerald-900/10"
      : overdue && !isIncome
      ? "bg-red-50/45 dark:bg-red-900/20"
      : isIncome
      ? "bg-emerald-50/25 dark:bg-emerald-900/15"
      : "bg-red-50/25 dark:bg-red-900/15";


  /* ------------------------------------------------------
      SALVAR INLINE
  ------------------------------------------------------ */
  const handleInlineSave = async (
    field: EditableItemField,
    value: any,
    msg = "Alterações salvas"
  ) => {
    try {
      await updateInline(item, field, value);

      Swal.fire({
        icon: "success",
        title: msg,
        timer: 900,
        showConfirmButton: false,
        customClass: { popup: "swal-pastel-popup" },
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Erro ao salvar",
        text: "Tente novamente.",
        confirmButtonColor: "#7B61FF",
      });
    }
  };


  /* ------------------------------------------------------
      TOOLTIPS (já corrigidos acima)
  ------------------------------------------------------ */
  const [tipDesc, setTipDesc] = useState(false);
  const [tipCat, setTipCat] = useState(false);
  const [tipVal, setTipVal] = useState(false);
  const [tipDate, setTipDate] = useState(false);
  const [tipPay, setTipPay] = useState(false);
  const [tipBank, setTipBank] = useState(false);
  const [tipActions, setTipActions] = useState(false);


  /* ------------------------------------------------------
      RENDER
  ------------------------------------------------------ */
  return (
    <tr
      className={`
        border-b last:border-none rounded-3xl relative transition-all
        ${rowBg}

        hover:bg-[#F4F0FF]/60 dark:hover:bg-[#ffffff0a]

        border-gray-200 dark:border-[#332b46]
      `}
    >

      {/* OVERLAY DE LOADING — NÃO MUDA TAMANHO DA ROW */}
      {isUpdating && (
        <div
          className="
            absolute inset-0 
            bg-white/55 dark:bg-black/30 backdrop-blur-sm
            flex items-center justify-center 
            z-50 rounded-3xl
          "
        >
          <Spinner />
        </div>
      )}


      {/* ----------------------------------------------------------
          COLUNA: ÍNDICE
      ---------------------------------------------------------- */}
      <td
        className="
          py-6 px-4 text-center font-semibold
          text-gray-700 dark:text-gray-200
          w-10 border-r border-gray-200 dark:border-[#322b44]
        "
      >
        {index + 1}
      </td>


      {/* ----------------------------------------------------------
          COLUNA: DESCRIÇÃO
      ---------------------------------------------------------- */}
      <td className="py-6 px-4 w-[34%] border-r border-gray-200 dark:border-[#322b44] relative">
        <div
          className="absolute -top-1 left-1 cursor-pointer"
          onMouseEnter={() => setTipDesc(true)}
          onMouseLeave={() => setTipDesc(false)}
        >
          <HelpCircle size={16} className="text-gray-500 dark:text-gray-300" />
          {tipDesc && (
            <Tooltip text="Edite a descrição. É salva automaticamente ao sair." />
          )}
        </div>

        <div className="flex flex-col gap-3">

          <span
            className={`inline-flex items-center px-4 py-1 rounded-full
              text-xs font-semibold w-fit ${badgeBg}`}
          >
            {badgeIcon}
            {badgeText}
          </span>

          <input
            type="text"
            disabled={isUpdating}
            value={item.description ?? ""}
            className="
              bg-white dark:bg-[#1d1a27]
              border border-[#E6E1F7] dark:border-[#322b44]

              rounded-2xl px-4 py-3 w-full outline-none
              text-sm shadow-sm font-medium

              text-gray-700 dark:text-gray-200

              focus:ring-2 focus:ring-[#B7A4FF]

              transition-all
            "
            onChange={(e) =>
              updateLocalItemField(item, "description", e.target.value)
            }
            onBlur={(e) => handleInlineSave("description", e.target.value)}
          />
        </div>
      </td>


      {/* ----------------------------------------------------------
          COLUNA: CATEGORIA
      ---------------------------------------------------------- */}
      <td className="py-6 px-4 w-[20%] border-r border-gray-200 dark:border-[#322b44] relative">

        <div
          className="absolute -top-1 left-1 cursor-pointer"
          onMouseEnter={() => setTipCat(true)}
          onMouseLeave={() => setTipCat(false)}
        >
          <HelpCircle size={16} className="text-gray-500 dark:text-gray-300" />
          {tipCat && <Tooltip text="Selecione uma categoria." />}
        </div>

        <div className="flex items-center gap-3 w-full">
          <div
            className="
              w-10 h-10 rounded-2xl 
              border border-[#E6E1F7] dark:border-[#322b44]
              bg-[#F8F7FF] dark:bg-[#2a2435]
              shadow-sm flex items-center justify-center
            "
          >
            <CatIcon size={20} className="text-amber-700 dark:text-amber-200" />
          </div>

          <select
            disabled={isUpdating}
            value={item.category_id ?? ""}

            className="
              w-full bg-white dark:bg-[#1d1a27]
              border border-[#E6E1F7] dark:border-[#322b44]

              rounded-2xl px-4 py-3
              text-sm shadow-sm outline-none cursor-pointer

              text-gray-700 dark:text-gray-200

              focus:ring-2 focus:ring-[#B7A4FF]
              transition
            "

            onChange={(e) => {
              const val = e.target.value ? Number(e.target.value) : null;
              updateLocalItemField(item, "category_id", val);
              handleInlineSave("category_id", val);
            }}
          >
            <option value="">Sem categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </td>


      {/* ----------------------------------------------------------
          COLUNA: VALOR
      ---------------------------------------------------------- */}
      <td className="py-6 px-4 w-[12%] border-r border-gray-200 dark:border-[#322b44] relative">

        <div
          className="absolute -top-1 left-1 cursor-pointer"
          onMouseEnter={() => setTipVal(true)}
          onMouseLeave={() => setTipVal(false)}
        >
          <HelpCircle size={16} className="text-gray-500 dark:text-gray-300" />
          {tipVal && <Tooltip text="Digite o valor." />}
        </div>

        <div className="flex items-center gap-2 justify-center">
          <DollarSign
            size={18}
            className={
              isIncome
                ? "text-green-600 dark:text-green-300"
                : "text-red-600 dark:text-red-300"
            }
          />

          <input
            type="number"
            disabled={isUpdating}
            value={item.value}
            className="
              bg-white dark:bg-[#1d1a27]
              border border-[#E6E1F7] dark:border-[#322b44]

              rounded-2xl px-4 py-3
              text-gray-700 dark:text-gray-200 
              shadow-sm outline-none text-sm font-semibold
              max-w-[90px]

              focus:ring-2 focus:ring-[#B7A4FF]

              transition-all
            "
            onChange={(e) =>
              updateLocalItemField(item, "value", Number(e.target.value) || 0)
            }
            onBlur={(e) =>
              handleInlineSave("value", Number(e.target.value) || 0)
            }
          />
        </div>
      </td>


      {/* ----------------------------------------------------------
          COLUNA: DATA / VENCIMENTO
      ---------------------------------------------------------- */}
      <td className="py-6 px-4 w-[18%] border-r border-gray-200 dark:border-[#322b44] text-center relative">

        <div
          className="absolute -top-1 left-1 cursor-pointer"
          onMouseEnter={() => setTipDate(true)}
          onMouseLeave={() => setTipDate(false)}
        >
          <HelpCircle size={16} className="text-gray-500 dark:text-gray-300" />
          {tipDate && <Tooltip text="Selecione a data. Salva automaticamente." />}
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-gray-600 dark:text-gray-300 text-xs italic mb-1">
            {isIncome ? "Entrada" : "Vencimento"}
          </span>

          <div
            className="
              flex items-center gap-2
              bg-white dark:bg-[#1d1a27]
              border border-[#E6E1F7] dark:border-[#322b44]

              rounded-2xl px-4 py-3 shadow-sm
              transition-all

              hover:shadow-lg hover:border-[#C9B8FF]
              dark:hover:border-[#9d8aff]
            "
          >
            <Calendar size={18} className="text-gray-600 dark:text-gray-300" />

            <input
              type="date"
              disabled={isUpdating}
              className="
                bg-transparent
                text-gray-700 dark:text-gray-200
                outline-none flex-1
              "
              value={normalizeDate(item.date) ?? ""}
              onChange={(e) =>
                updateLocalItemField(item, "date", normalizeDate(e.target.value))
              }
              onBlur={(e) =>
                handleInlineSave("date", normalizeDate(e.target.value))
              }
            />
          </div>
        </div>

        {!isIncome && !isPaid && overdue && (
          <div
            className="
              absolute bottom-2 left-2 
              bg-red-600 dark:bg-red-800 
              text-white text-xs px-3 py-1 rounded-xl shadow flex gap-1
            "
          >
            <AlertTriangle size={12} />
            Vencido desde {formatDateToText(addOneDay(normalizeDate(item.date)))}
          </div>
        )}
      </td>


      {/* ----------------------------------------------------------
          COLUNA: PAGAMENTO
      ---------------------------------------------------------- */}
      <td className="py-6 px-4 w-[10%] border-r border-gray-200 dark:border-[#322b44] text-center relative">

        <div
          className="absolute -top-1 left-1 cursor-pointer"
          onMouseEnter={() => setTipPay(true)}
          onMouseLeave={() => setTipPay(false)}
        >
          <HelpCircle size={16} className="text-gray-500 dark:text-gray-300" />
          {tipPay && <Tooltip text="Marcar ou remover pagamento." />}
        </div>

        {/* botão PAGAR */}
        {!isIncome && !isPaid && (
          <button
            disabled={isUpdating}
            className="
              px-5 py-2 rounded-xl text-sm font-bold
              bg-emerald-200 dark:bg-emerald-800/40
              text-emerald-900 dark:text-emerald-100
              border border-emerald-300 dark:border-emerald-700
              shadow-sm hover:shadow-md hover:-translate-y-[2px]
              transition-all
            "
            onClick={async () => {
              const today = getTodayIso();
              updateLocalItemField(item, "paid_at", today);
              await handleInlineSave("paid_at", today, "Pagamento registrado!");
            }}
          >
            PAGAR
          </button>
        )}

        {/* botão PAGAMENTO JÁ FEITO */}
        {!isIncome && isPaid && (
          <button
            disabled={isUpdating}
            className="
              px-3 py-2 rounded-xl shadow 
              bg-emerald-500 dark:bg-emerald-700 
              text-white hover:shadow-lg hover:-translate-y-[2px]
              transition-all
            "
            onClick={async () => {
              updateLocalItemField(item, "paid_at", null);
              await handleInlineSave("paid_at", null, "Pagamento removido");
            }}
          >
            <CheckCircle2 size={18} />
          </button>
        )}

        {/* receita nunca tem pagamento */}
        {isIncome && (
          <div className="text-xs text-gray-500 dark:text-gray-400 italic">—</div>
        )}
      </td>


      {/* ----------------------------------------------------------
          COLUNA: BANCO
      ---------------------------------------------------------- */}
      <td className="py-6 px-4 w-[16%] border-r border-gray-200 dark:border-[#322b44] relative">

        <div
          className="absolute -top-1 left-1 cursor-pointer"
          onMouseEnter={() => setTipBank(true)}
          onMouseLeave={() => setTipBank(false)}
        >
          <HelpCircle size={16} className="text-gray-500 dark:text-gray-300" />
          {tipBank && <Tooltip text="Selecione o banco." />}
        </div>

        <div className="flex items-center gap-3 w-full">
          <div
            className="
              w-10 h-10 rounded-2xl 
              border border-[#E6E1F7] dark:border-[#322b44]
              bg-[#F8F7FF] dark:bg-[#2a2435]
              shadow-sm flex items-center justify-center
            "
          >
            <Landmark size={20} className="text-indigo-600 dark:text-indigo-300" />
          </div>

          <select
            disabled={isUpdating}
            value={item.bank_id ?? ""}

            className="
              bg-white dark:bg-[#1d1a27]
              border border-[#E6E1F7] dark:border-[#322b44]

              rounded-2xl px-4 py-3 text-sm shadow-sm
              text-gray-700 dark:text-gray-200
              outline-none cursor-pointer

              focus:ring-2 focus:ring-[#B7A4FF]
              transition
            "

            onChange={(e) => {
              const v = e.target.value ? Number(e.target.value) : null;
              updateLocalItemField(item, "bank_id", v);
              handleInlineSave("bank_id", v);
            }}
          >
            <option value="">Sem banco</option>
            {banks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </td>


      {/* ----------------------------------------------------------
          COLUNA: AÇÕES
      ---------------------------------------------------------- */}
      <td className="py-6 px-4 w-36 text-center relative">

        <div
          className="absolute -top-1 left-1 cursor-pointer"
          onMouseEnter={() => setTipActions(true)}
          onMouseLeave={() => setTipActions(false)}
        >
          <HelpCircle size={16} className="text-gray-500 dark:text-gray-300" />
          {tipActions && <Tooltip text="Editar ou excluir item." />}
        </div>

        <div className="flex items-center gap-5 justify-center">

          {/* editar */}
          <button
            disabled={isUpdating}
            className="
              text-[#7B61FF] dark:text-[#B7A4FF]
              flex items-center gap-1 text-sm
              px-3 py-2 rounded-xl 
              border border-[#E6E1F7] dark:border-[#322b44]
              bg-white dark:bg-[#1d1a27] shadow-sm
              hover:bg-[#EFEAFF] dark:hover:bg-[#ffffff0a]
              transition
            "
            onClick={() => openEditItemModal(item)}
          >
            <Pencil size={15} />
            Editar
          </button>

          {/* excluir */}
          <button
            disabled={isUpdating}
            className="
              text-red-600 dark:text-red-400 
              flex items-center gap-1 text-sm
              px-3 py-2 rounded-xl
              border border-red-200 dark:border-red-900
              bg-white dark:bg-[#1d1a27] shadow-sm
              hover:bg-red-50 dark:hover:bg-red-900/30
              transition
            "
            onClick={async () => {
              const confirm = await Swal.fire({
                icon: "warning",
                title: "Tem certeza?",
                text: "Este item será removido permanentemente.",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#7B61FF",
                confirmButtonText: "Excluir",
                cancelButtonText: "Cancelar",
                customClass: { popup: "swal-pastel-popup" },
              });

              if (confirm.isConfirmed) await deleteInline(item);
            }}
          >
            <Trash2 size={15} />
            Excluir
          </button>
        </div>
      </td>
    </tr>
  );
}
