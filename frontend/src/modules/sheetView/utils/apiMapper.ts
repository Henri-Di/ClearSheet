import type { UnifiedItem } from "../types/sheet";

export function apiItemToUnified(raw: any): UnifiedItem {

  const extractDate = (d: any): string | null => {
    if (!d) return null;

    if (typeof d === "string") return d.slice(0, 10);

    if (typeof d === "object" && d.date) {
      return String(d.date).slice(0, 10);
    }

    return null;
  };

  return {
    id: raw.id,
    sheet_id: raw.sheet_id ?? null,

    value: Number(raw.value ?? 0),

    type: raw.type ?? "income",
    description: raw.description ?? "",

    date: extractDate(raw.date),
    paid_at: extractDate(raw.paid_at),

    category: raw.category ?? null,
    category_id: raw.category_id ?? null,

    bank: raw.bank ?? null,
    bank_id: raw.bank_id ?? null,

    origin: raw.origin ?? "sheet",

    raw,
  };
}
