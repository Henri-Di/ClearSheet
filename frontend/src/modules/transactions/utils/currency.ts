export function formatCurrency(v: any) {
  if (v === null || v === undefined) return "R$ 0,00";

  const normalized =
    typeof v === "string"
      ? Number(v.replace(/\./g, "").replace(",", "."))
      : Number(v);

  const n = isNaN(normalized) ? 0 : normalized;

  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
