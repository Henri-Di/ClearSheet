export function normalize(str: string) {
  return str
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}


export function normalizeIsoDate(input: string | null): string | null {
  if (!input) return null;

  if (/^\d{4}-\d{2}-\d{2}/.test(input)) return input.slice(0, 10);

  const d = new Date(input);
  if (isNaN(d.getTime())) return null;

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}


export function formatDateToText(date: string | null) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR");
}


export function getTodayIso() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;
}


export function isOverdue(item: any) {
  if (!item.date) return false;
  if (item.type !== "expense") return false;
  if (item.paid_at) return false;

  const today = new Date();
  const due = new Date(item.date);

  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return due < todayOnly;
}
