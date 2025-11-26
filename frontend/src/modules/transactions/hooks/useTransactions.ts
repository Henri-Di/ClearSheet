import { useEffect, useMemo, useState } from "react";
import { api } from "../../../services/api";

import type { Transaction } from "../types/Transaction";
import type { Bank } from "../types/Bank";
import type { Category } from "../types/Category";
import type { Filters } from "../types/Filters";

import { normalize } from "../utils/normalize";
import { BankIcons, BankBg, resolveBankKey } from "../utils/bankMaps";

function normalizeDate(d: any): string | null {
  if (!d) return null;
  const clean = String(d).slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(clean) ? clean : null;
}

function safeNumber(v: any) {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

function groupBanks(transactions: Transaction[], dateStart: string, dateEnd: string) {
  const grouped: Record<string, any> = {};

  for (const t of transactions) {
    if (!t.bank) continue;

    const d = normalizeDate(t.date);
    if (dateStart && d && d < dateStart) continue;
    if (dateEnd && d && d > dateEnd) continue;

    const rawName = t.bank.name || "Desconhecido";
    const key = resolveBankKey(rawName);

    if (!grouped[key]) {
      grouped[key] = {
        key,
        title: rawName,
        income: 0,
        expense: 0,
        transactions: [],
        icon: BankIcons[key] || BankIcons.default,
        bg: BankBg[key] || BankBg.default,
      };
    }

    const val = safeNumber(t.value);
    if (t.type === "income") grouped[key].income += val;
    else grouped[key].expense += val;

    grouped[key].transactions.push(t);
  }

  Object.values(grouped).forEach((b: any) => {
    if (b.transactions.length === 0) {
      b.transactions = [
        { type: "income", value: b.income, date: null },
        { type: "expense", value: b.expense, date: null },
      ];
    }
  });

  Object.values(grouped).forEach((b: any) => {
    b.transactions.sort((a: Transaction, b2: Transaction) => {
      const A = a.date || "";
      const B = b2.date || "";
      return A.localeCompare(B);
    });
  });

  return Object.values(grouped).sort((a: any, b: any) => {
    const sA = a.income - a.expense;
    const sB = b.income - b.expense;
    return sB - sA;
  });
}

export function useTransactions() {
  const [loading, setLoading] = useState(true);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [refreshKey, setRefreshKey] = useState(0);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    dateStart: "",
    dateEnd: "",
    sortField: "date",
    sortDirection: "desc",
  });

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  async function load() {
    try {
      setLoading(true);

      const [itemsRes, transRes, banksRes, catRes] = await Promise.all([
        api.get("/items/all"),
        api.get("/transactions/all"),
        api.get("/banks"),
        api.get("/categories"),
      ]);

      const banksList = banksRes.data?.data || banksRes.data || [];
      const categoriesList = catRes.data?.data || catRes.data || [];

      setBanks(banksList);
      setCategories(categoriesList);

      const rawItems: any[] = itemsRes.data?.data || itemsRes.data || [];
      const items: Transaction[] = rawItems.map((raw: any) => ({
        ...raw,
        date: normalizeDate(raw.date),
        paid_at: normalizeDate(raw.paid_at),
        origin: "sheet",
        category: categoriesList.find((c: any) => c.id === raw.category_id) || null,
        bank: banksList.find((b: any) => b.id === raw.bank_id) || null,
      }));

      const rawTrans: any[] = transRes.data?.data || transRes.data || [];
      const trans: Transaction[] = rawTrans.map((raw: any) => ({
        ...raw,
        date: normalizeDate(raw.date),
        paid_at: normalizeDate(raw.paid_at),
        origin: "transaction",
        category: categoriesList.find((c: any) => c.id === raw.category_id) || null,
        bank: banksList.find((b: any) => b.id === raw.bank_id) || null,
      }));

      setTransactions([...items, ...trans]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [refreshKey]);

  const filtered = useMemo(() => {
    let list = [...transactions];
    const term = normalize(filters.search);

    if (term) {
      list = list.filter((t) => {
        const fields = [
          t.description ?? "",
          t.category?.name ?? "",
          t.bank?.name ?? "",
          String(t.value),
          t.type,
          t.origin,
          t.paid_at ? "pago" : "nao pago",
        ].map((v) => normalize(v));

        return fields.some((f) => f.includes(term));
      });
    }

    if (filters.dateStart) {
      list = list.filter((t) => t.date && t.date >= filters.dateStart);
    }

    if (filters.dateEnd) {
      list = list.filter((t) => t.date && t.date <= filters.dateEnd);
    }

    const dir = filters.sortDirection === "asc" ? 1 : -1;
    list.sort((a, b) => {
      const A = a.date || "";
      const B = b.date || "";
      return A < B ? -1 * dir : A > B ? 1 * dir : 0;
    });

    return list;
  }, [transactions, filters]);

  const entradas = filtered
    .filter((t) => t.type === "income")
    .reduce((s, i) => s + safeNumber(i.value), 0);

  const saidas = filtered
    .filter((t) => t.type === "expense")
    .reduce((s, i) => s + safeNumber(i.value), 0);

  const saldo = entradas - saidas;

  const groupedBanks = useMemo(() => {
    return groupBanks(filtered, filters.dateStart, filters.dateEnd);
  }, [filtered, filters.dateStart, filters.dateEnd]);

  return {
    loading,
    filtered,
    groupedBanks,
    banks,
    categories,
    entradas,
    saidas,
    saldo,
    filters,
    setFilters,
    refresh,  
  };
}
