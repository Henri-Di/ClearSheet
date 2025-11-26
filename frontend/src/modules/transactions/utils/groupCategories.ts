import { normalize } from "./normalize";
import type { Transaction } from "../types/Transaction";

export function groupCategories(entries: Transaction[]) {
  const groups: Record<string, any> = {};

  for (const t of entries) {
    const ct = t.category?.name ?? "Sem categoria";
    const key = normalize(ct);

    if (!groups[key]) {
      groups[key] = {
        title: ct,
        value: 0,
        transactions: [],
      };
    }

    groups[key].value += Number(t.value);
    groups[key].transactions.push(t);
  }

  return Object.values(groups).sort((a, b) => b.value - a.value);
}
