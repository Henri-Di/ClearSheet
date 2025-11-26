import { normalize } from "./normalize";
import type { Transaction } from "../types/Transaction";

export function groupBanks(transactions: Transaction[]) {
  const groups: Record<string, any> = {};

  for (const t of transactions) {
    const bk = t.bank?.name ?? "Sem banco";
    const key = normalize(bk);

    if (!groups[key]) {
      groups[key] = {
        title: bk,
        income: 0,
        expense: 0,
        transactions: [],
      };
    }

    if (t.type === "income") groups[key].income += Number(t.value);
    else groups[key].expense += Number(t.value);

    groups[key].transactions.push(t);
  }

  return Object.values(groups).sort((a: any, b: any) => {
    const sA = a.income - a.expense;
    const sB = b.income - b.expense;
    return sB - sA;
  });
}
