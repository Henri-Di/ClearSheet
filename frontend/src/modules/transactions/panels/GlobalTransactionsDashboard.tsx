import { motion } from "framer-motion";
import { BarChart2 } from "lucide-react";

import { useTransactions } from "../hooks/useTransactions";

import { SummaryCards } from "../components/SummaryCards";
import { SparklineDual } from "../components/SparklineDual";
import { TransactionsTable } from "../components/TransactionsTable";
import { FiltersBar } from "../components/FiltersBar";
import { BankCard } from "../components/BankCard";

export function GlobalTransactionsDashboard() {
  const {
    filtered,
    entradas,
    saidas,
    saldo,
    groupedBanks,
    categories,
    loading,
    filters,
    setFilters,
  } = useTransactions();

  const listSafe = Array.isArray(filtered) ? filtered : [];
  const banksSafe = Array.isArray(groupedBanks) ? groupedBanks : [];

  return (
    <div className="p-6 flex flex-col gap-8 text-inherit">

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          rounded-3xl
          bg-white dark:bg-[#1a1625]
          border border-[#E1E0EB] dark:border-[#2c2536]
          shadow-sm p-6 flex flex-col gap-6
          text-gray-800 dark:text-gray-100
        "
      >
        <h1 className="text-2xl font-black text-inherit">
          Painel Global de Transações
        </h1>

        <FiltersBar filters={filters} setFilters={setFilters} />
      </motion.div>

      <SummaryCards entradas={entradas} saidas={saidas} saldo={saldo} />

      {banksSafe.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
            grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4
            gap-6 text-inherit
          "
        >
          {banksSafe.map((bank) => (
            <BankCard key={bank.key} bank={bank} />
          ))}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          rounded-3xl
          bg-white dark:bg-[#1a1625]
          border border-[#E1E0EB] dark:border-[#2c2536]
          shadow-sm p-6 text-inherit
        "
      >
        <div className="flex items-center gap-3 mb-3 text-inherit">
          <BarChart2
            size={20}
            className="text-[#7B61FF] dark:text-[#9f8aff]"
          />
          <h2 className="font-semibold text-lg text-inherit">
            Fluxo Consolidado
          </h2>
        </div>

        {listSafe.length > 0 ? (
          <SparklineDual transactions={listSafe} />
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-4">
            Nenhuma transação encontrada no período.
          </p>
        )}
      </motion.div>

      <TransactionsTable
        transactions={listSafe}
        loading={loading}
        banks={banksSafe}
        categories={categories}
      />
    </div>
  );
}
