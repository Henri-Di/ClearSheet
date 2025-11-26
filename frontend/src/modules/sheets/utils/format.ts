export function formatCurrency(value: number | null | undefined) {
  if (value == null || isNaN(Number(value))) return "R$ 0,00";
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}
