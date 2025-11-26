export function normalizeSummary(raw: any, fallbackInitial: number) {
  const entradas = Number(raw?.entradas ?? raw?.income ?? 0);
  const saidas  = Number(raw?.saidas  ?? raw?.expense ?? 0);
  const initial = Number(raw?.initial ?? raw?.initial_balance ?? fallbackInitial ?? 0);
  const saldo_final = Number(raw?.saldo_final ?? raw?.balance ?? initial + entradas - saidas);

  return { entradas, saidas, initial, saldo_final };
}
