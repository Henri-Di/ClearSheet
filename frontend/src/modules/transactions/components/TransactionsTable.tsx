import { useState } from "react";
import { motion } from "framer-motion";

import {
  ArrowDownCircle,
  ArrowUpCircle,
  Receipt,
  Landmark,
  CalendarDays,
} from "lucide-react";

import { formatCurrency } from "../utils/currency";
import { EmptyState } from "./EmptyState";

function CorporateLoader() {
  return (
    <div className="w-full flex flex-col items-center gap-4 py-16 text-center">
      <div className="flex flex-col gap-3 w-8/12 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="
              h-5 rounded-full
              bg-gradient-to-r from-[#EDEAFF] to-[#F6F3FF]
              dark:from-[#2a2535] dark:to-[#1f1a28]
              animate-shimmer
            "
          />
        ))}
      </div>

      <p className="text-gray-500 dark:text-gray-300 text-base">
        Carregando transações...
      </p>
    </div>
  );
}

export function TransactionsTable({ transactions, loading }: any) {
  const [hoverColumn, setHoverColumn] = useState<string | null>(null);

  if (loading) return <CorporateLoader />;

  if (!transactions.length)
    return (
      <EmptyState
        title="Nenhuma transação encontrada"
        subtitle="Tente ajustar os filtros ou datas."
      />
    );

  return (
    <div className="overflow-x-auto mt-10 text-inherit">
      <table className="w-full text-[15px] border-separate border-spacing-y-3">
        
      
        <thead
          className="
            sticky top-0 z-20 
            bg-white/90 dark:bg-[#1a1625]/90 
            backdrop-blur-md shadow-sm
          "
        >
          <tr className="text-left text-gray-700 dark:text-gray-200 select-none">
            {["Descrição", "Categoria", "Banco", "Data", "Valor"].map(
              (label, idx) => (
                <th
                  key={idx}
                  className={`
                    px-5 pb-4 font-semibold text-[13px] tracking-wide uppercase 
                    border-b border-[#ECE9FA] dark:border-[#2c2536]
                    transition
                    ${
                      hoverColumn === label
                        ? "text-[#7B61FF] dark:text-[#B7A4FF]"
                        : "text-gray-600 dark:text-gray-300"
                    }
                  `}
                  onMouseEnter={() => setHoverColumn(label)}
                  onMouseLeave={() => setHoverColumn(null)}
                >
                  {label}
                </th>
              )
            )}
          </tr>
        </thead>

   
        <tbody className="text-gray-800 dark:text-gray-100">
          {transactions.map((t: any, i: number) => (
            <motion.tr
              key={`${t.id}-${t.origin}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="
                group
                bg-white dark:bg-[#1d1a27]
                rounded-3xl shadow-sm
                transition-all hover:shadow-lg hover:-translate-y-[1px]
              "
            >

      
              <td
                className={`px-5 py-5 transition-colors ${
                  hoverColumn === "Descrição"
                    ? "bg-[#F8F6FF] dark:bg-[#241f33]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {t.type === "income" ? (
                    <ArrowUpCircle
                      className="text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform"
                      size={26}
                    />
                  ) : (
                    <ArrowDownCircle
                      className="text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform"
                      size={26}
                    />
                  )}

                  <div className="flex flex-col">
                    <span className="font-semibold text-[15px]">
                      {t.description}
                    </span>

                    <span
                      className={`
                        text-[11px] px-2 py-[2px] rounded-full border mt-1 w-fit
                        ${
                          t.origin === "sheet"
                            ? "bg-[#F1ECFF] dark:bg-[#2c2540] border-[#D8D0FF] dark:border-[#564b70] text-[#7B61FF] dark:text-[#B7A4FF]"
                            : "bg-[#E9FDF5] dark:bg-[#1f332c] border-[#B8F5DB] dark:border-[#3e7a65] text-[#3EB37E] dark:text-[#67e0ad]"
                        }
                      `}
                    >
                      {t.origin === "sheet" ? "Planilha" : "Transação"}
                    </span>
                  </div>
                </div>
              </td>

         
              <td
                className={`px-5 py-5 transition ${
                  hoverColumn === "Categoria"
                    ? "bg-[#F8F6FF] dark:bg-[#241f33]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Receipt size={20} className="text-gray-400 dark:text-gray-500" />
                  <span className="text-[15px]">{t.category?.name ?? "—"}</span>
                </div>
              </td>

              <td
                className={`px-5 py-5 transition ${
                  hoverColumn === "Banco"
                    ? "bg-[#F8F6FF] dark:bg-[#241f33]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Landmark size={20} className="text-gray-400 dark:text-gray-500" />
                  <span className="text-[15px]">{t.bank?.name ?? "—"}</span>
                </div>
              </td>

              <td
                className={`px-5 py-5 transition ${
                  hoverColumn === "Data"
                    ? "bg-[#F8F6FF] dark:bg-[#241f33]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <CalendarDays size={19} className="text-gray-400 dark:text-gray-500" />
                  <span className="text-[15px]">
                    {t.date
                      ? new Date(t.date).toLocaleDateString("pt-BR")
                      : "—"}
                  </span>
                </div>
              </td>

      
              <td
                className="px-5 py-5 text-right transition"
                onMouseEnter={() => setHoverColumn("Valor")}
                onMouseLeave={() => setHoverColumn(null)}
              >
                <div
                  className={`
                    flex flex-col items-end gap-1 font-bold text-[16px]
                    ${
                      t.type === "income"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  `}
                >
                  {formatCurrency(Number(t.value))}

                  <motion.div
                    layout
                    className={`
                      h-1.5 w-14 rounded-full opacity-70
                      ${
                        t.type === "income"
                          ? "bg-green-400 dark:bg-green-500"
                          : "bg-red-400 dark:bg-red-500"
                      }
                    `}
                  />
                </div>
              </td>

            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
