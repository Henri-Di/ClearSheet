import { useMemo, useState } from "react";
import { motion } from "framer-motion";

interface Transaction {
  type: "income" | "expense";
  value: number | string;
  date?: string | null | undefined;
}

interface SparklineDualProps {
  transactions: Transaction[];
  height?: number;
}

export function SparklineDual({
  transactions,
  height = 60,
}: SparklineDualProps) 
{
  
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return (
      <p className="text-xs text-gray-400 mt-2">
        Nenhum dado para gerar gráfico.
      </p>
    );
  }

  const { inc, out, min, max } = useMemo(() => {
    const incomes: number[] = [];
    const expenses: number[] = [];

    for (const t of transactions) {
      if (!t || t.value == null) continue;

      const val = Number(String(t.value).replace(",", "."));
      if (isNaN(val)) continue;

      if (t.type === "income") incomes.push(val);
      if (t.type === "expense") expenses.push(-Math.abs(val));
    }

    const all = [...incomes, ...expenses];

    let min = all.length ? Math.min(...all) : 0;
    let max = all.length ? Math.max(...all) : 1;

    if (min === max) {
      const pad = Math.abs(min) * 0.1 || 1;
      min -= pad;
      max += pad;
    }

    if (incomes.length > 0 && expenses.length === 0) {
      min = Math.min(min, 0);
    }
    if (expenses.length > 0 && incomes.length === 0) {
      max = Math.max(max, 0);
    }

    return { inc: incomes, out: expenses, min, max };
  }, [transactions]);

  if (inc.length === 0 && out.length === 0) {
    return (
      <p className="text-xs text-gray-400 mt-2">
        Nenhum dado para gerar gráfico.
      </p>
    );
  }

  const range = max - min || 1;

  const bezierPath = (vals: number[]) => {
    if (vals.length <= 1) return "";

    const w = 100;
    const step = w / (vals.length - 1);

    let d = "";

    vals.forEach((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * height;

      if (i === 0) {
        d += `M ${x},${y}`;
      } else {
        const prevX = (i - 1) * step;
        const prevY =
          height - ((vals[i - 1] - min) / range) * height;

        const tension = 0.45;

        const cx1 = prevX + step * tension;
        const cy1 = prevY;

        const cx2 = x - step * tension;
        const cy2 = y;

        d += ` C ${cx1},${cy1} ${cx2},${cy2} ${x},${y}`;
      }
    });

    return d;
  };

  const pathInc = bezierPath(inc);
  const pathOut = bezierPath(out);

  const [cursor, setCursor] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - r.left) / r.width) * 100;

    setCursor(pct);

    const index = Math.round((pct / 100) * (inc.length - 1));
    if (index >= 0 && index < inc.length) {
      setHoverIndex(index);
    }
  };

  const handleLeave = () => {
    setCursor(null);
    setHoverIndex(null);
  };

  const tooltip =
    hoverIndex !== null
      ? {
          entrada: inc[hoverIndex] ?? 0,
          saida: Math.abs(out[hoverIndex] ?? 0),
        }
      : null;

  return (
    <div className="relative mt-4 select-none">

      <svg
        width="100%"
        height={height}
        viewBox={`0 0 100 ${height}`}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ cursor: "crosshair" }}
      >
    
        <defs>
          <linearGradient id="grad-inc" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(30,180,110,0.9)" />
            <stop offset="100%" stopColor="rgba(30,180,110,0.15)" />
          </linearGradient>

          <linearGradient id="grad-out" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(240,70,70,0.9)" />
            <stop offset="100%" stopColor="rgba(240,70,70,0.15)" />
          </linearGradient>
        </defs>

        {inc.length > 1 && (
          <motion.path
            d={`${pathInc} L 100 ${height} L 0 ${height} Z`}
            fill="url(#grad-inc)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
          />
        )}

        {out.length > 1 && (
          <motion.path
            d={`${pathOut} L 100 ${height} L 0 ${height} Z`}
            fill="url(#grad-out)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
          />
        )}

        {inc.length > 1 && (
          <motion.path
            d={pathInc}
            fill="none"
            stroke="rgba(30,180,110,0.95)"
            strokeWidth="2.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
            style={{
              filter:
                "drop-shadow(0 0 6px rgba(30,180,110,0.6)) drop-shadow(0 0 3px rgba(30,180,110,0.5))",
            }}
          />
        )}

        {out.length > 1 && (
          <motion.path
            d={pathOut}
            fill="none"
            stroke="rgba(240,70,70,0.95)"
            strokeWidth="2.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1 }}
            style={{
              filter:
                "drop-shadow(0 0 6px rgba(240,70,70,0.6)) drop-shadow(0 0 3px rgba(240,70,70,0.5))",
            }}
          />
        )}

        {cursor !== null && (
          <motion.line
            x1={cursor}
            x2={cursor}
            y1={0}
            y2={height}
            stroke="rgba(0,0,0,0.25)"
            strokeWidth={0.6}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}


        {hoverIndex !== null && inc[hoverIndex] !== undefined && (
          <motion.circle
            cx={(hoverIndex / (inc.length - 1)) * 100}
            cy={(() => {
              const v = inc[hoverIndex];
              return height - ((v - min) / range) * height;
            })()}
            r="4.5"
            fill="#fff"
            stroke="rgba(30,180,110,0.95)"
            strokeWidth="1.4"
            animate={{ scale: [1, 1.45, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
        )}

        {hoverIndex !== null && out[hoverIndex] !== undefined && (
          <motion.circle
            cx={(hoverIndex / (out.length - 1)) * 100}
            cy={(() => {
              const v = out[hoverIndex];
              return height - ((v - min) / range) * height;
            })()}
            r="4.5"
            fill="#fff"
            stroke="rgba(240,70,70,0.95)"
            strokeWidth="1.4"
            animate={{ scale: [1, 1.45, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
        )}
      </svg>

      {tooltip && cursor !== null && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            absolute px-3 py-2 text-xs rounded-lg shadow-xl 
            backdrop-blur-md pointer-events-none
            bg-black/75 text-white -translate-y-8
          "
          style={{
            left: `${cursor}%`,
            transform: "translateX(-50%) translateY(-8px)",
          }}
        >
          <div>
            Entrada:{" "}
            <b>{tooltip.entrada.toLocaleString("pt-BR")}</b>
          </div>
          <div>
            Saída:{" "}
            <b>{tooltip.saida.toLocaleString("pt-BR")}</b>
          </div>
        </motion.div>
      )}

      <div className="flex gap-4 text-xs mt-2 mb-3">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-green-600/70" />
          Entradas
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          Saídas
        </div>
      </div>
    </div>
  );
}
