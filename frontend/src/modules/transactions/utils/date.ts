export function normalizeDate(iso: string | null) {
  if (!iso) return null;
  return iso.slice(0, 10);
}

export function todayIso(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}
