import type { SheetSummary } from "../types/category";
import { AlertCircle, ArrowRight, Info } from "lucide-react";
import { formatCurrency } from "../utils/format";
import { useNavigate } from "react-router-dom";
import { SkeletonCategory } from "./Skeletons";

export function LinkedSheetsTable({
  loading,
  sheets,
}: {
  loading: boolean;
  sheets: SheetSummary[];
}) {
  const nav = useNavigate();

  if (loading)
    return (
      <table className="w-full">
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCategory key={i} />
          ))}
        </tbody>
      </table>
    );


  if (!sheets.length)
    return (
      <p className="p-6 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
        <AlertCircle size={16} className="text-[#7B61FF]" />
        Nenhuma planilha vinculada.
      </p>
    );

  return (
    <div className="overflow-x-auto mt-2">
      <table className="w-full text-sm">

        <thead
          className="
            bg-[#F6F4FF] text-[#4B4A54]
            dark:bg-[#18171D] dark:text-gray-300
            border-b border-[#E6E1F7] dark:border-[#2A2636]
          "
        >
          <tr>
            <th className="p-3 text-left">
              Nome <Tip label="Nome da planilha vinculada" />
            </th>

            <th className="p-3 text-left">
              Mês/Ano <Tip label="Competência da planilha" />
            </th>

            <th className="p-3 text-right">
              Entradas <Tip label="Total de lançamentos de entrada" />
            </th>

            <th className="p-3 text-right">
              Saídas <Tip label="Total de lançamentos de saída" />
            </th>

            <th className="p-3 text-right">
              Saldo Final <Tip label="Entradas - Saídas" />
            </th>

            <th className="p-3 text-right pr-4">
              Ações <Tip label="Abrir a planilha em nova tela" />
            </th>
          </tr>
        </thead>

        <tbody>
          {sheets.map((sheet) => (
            <tr
              key={sheet.id}
              className="
                border-t 
                border-[#F1EEF9] dark:border-[#2A2736]
                hover:bg-[#F9F6FF] dark:hover:bg-[#1F1E26]
                transition-colors
              "
            >
         
              <td className="p-3">
                <span className="font-medium text-[#2F2F36] dark:text-gray-200">
                  {sheet.name}
                </span>
              </td>

      
              <td className="p-3 text-[#4B4A54] dark:text-gray-400">
                {String(sheet.month).padStart(2, "0")}/{sheet.year}
              </td>


              <td className="p-3 text-right font-medium text-green-600 dark:text-green-400">
                {formatCurrency(sheet.income)}
              </td>

     
              <td className="p-3 text-right font-medium text-red-600 dark:text-red-400">
                {formatCurrency(sheet.expense)}
              </td>

        
              <td
                className={`
                  p-3 text-right font-semibold 
                  ${
                    sheet.balance >= 0
                      ? "text-[#2F4A8A] dark:text-blue-300"
                      : "text-red-600 dark:text-red-400"
                  }
                `}
              >
                {formatCurrency(sheet.balance)}
              </td>

              <td className="p-3 text-right">
                <button
                  className="
                    text-xs 
                    text-[#7B61FF] dark:text-indigo-300
                    hover:text-[#6A54E6] dark:hover:text-indigo-200
                    transition 
                    flex items-center gap-1 ml-auto
                  "
                  onClick={() => nav(`/sheets/${sheet.id}`)}
                >
                  Abrir <ArrowRight size={12} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}


function Tip({ label }: { label: string }) {
  return (
    <span
      className="
        inline-flex items-center ml-1 cursor-help relative group
        text-[#7B61FF] dark:text-indigo-300
        opacity-70 hover:opacity-100 transition
      "
    >
      <Info size={14} />

      <div
        className="
          absolute left-1/2 -translate-x-1/2 mt-6 
          hidden group-hover:flex 
          px-3 py-2 rounded-xl shadow-md 
          text-xs w-max z-20
          bg-white border border-[#E6E1F7] text-gray-700
          dark:bg-[#1B1A21] dark:border-[#2E2C38] dark:text-gray-200
        "
      >
        {label}
      </div>
    </span>
  );
}
