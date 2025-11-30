import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

import { motion } from "framer-motion";
import type { CategoryData } from "../types/dashboard";


const COLORS = [
  "hsl(262 85% 72%)",   
  "hsl(330 75% 70%)",   
  "hsl(222 75% 65%)",   
  "hsl(278 70% 72%)",   
  "hsl(32 85% 72%)",   
  "hsl(168 65% 60%)",   
  "hsl(200 75% 68%)", 
];


export function CategoriesPieChart2026({
  data,
}: {
  data: CategoryData[] | null | undefined;
}) {
  const safe = Array.isArray(data) ? data : [];

  if (!safe.length)
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Nenhum dado para exibir.
      </p>
    );

  const total = safe.reduce((s, c) => s + c.total, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="
        w-full h-[380px] 
        flex gap-10
        rounded-3xl
        relative
      "
    >

      <div
        className="
          absolute inset-0 
          rounded-3xl
          bg-gradient-to-br from-white/10 to-white/5
          dark:from-white/5 dark:to-white/[0.03]
          backdrop-blur-xl
          border border-white/20 dark:border-white/[0.08]
          shadow-[0_8px_40px_-10px_rgba(0,0,0,0.45)]
        "
      />


      <div className="flex-1 relative z-10 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Tooltip
              contentStyle={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(14px)",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "12px 18px",
                color: "#2F2F36",
              }}
              wrapperClassName="
                dark:!bg-dark-card/80 
                dark:!text-gray-200 
                dark:!border-dark-border
              "
              labelStyle={{ fontWeight: 600, color: "#7B61FF" }}
              isAnimationActive={false}
            />

            <defs>
              <radialGradient id="ringGlow" r="65%">
                <stop offset="60%" stopColor="rgba(255,255,255,0.25)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>

            <circle
              cx="50%"
              cy="50%"
              r="78"
              fill="url(#ringGlow)"
              className="dark:opacity-40 opacity-60"
            />

            <Pie
              data={safe}
              dataKey="total"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={60}
              paddingAngle={2}
              startAngle={90}
              endAngle={450}
              isAnimationActive={false}
              label={() => null} 
            >
              {safe.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                  style={{
                    transition: "0.3s cubic-bezier(0.25,0.1,0.25,1)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as SVGElement;
                    el.style.transform = "scale(1.06)";
                    el.style.filter = "brightness(1.28)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as SVGElement;
                    el.style.transform = "scale(1)";
                    el.style.filter = "brightness(1)";
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

 
      <div className="w-64 overflow-y-auto pr-2 z-10">
        {safe.map((cat, i) => {
          const pct = total > 0 ? (cat.total / total) * 100 : 0;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="
                flex flex-col gap-1 mb-4 p-3 rounded-2xl
                bg-white/40 dark:bg-white/5
                border border-white/30 dark:border-white/[0.08]
                backdrop-blur-lg
                hover:scale-[1.015] transition-all
                shadow-md
              "
            >
           
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-md shadow"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="text-sm font-semibold text-[#2F2F36] dark:text-gray-200">
                  {cat.name}
                </span>
              </div>

            
              <div className="flex justify-between">
                <span className="text-xs text-gray-700 dark:text-gray-400">
                  R$ {cat.total.toFixed(2)}
                </span>

                <span className="text-xs font-semibold text-primary dark:text-primary-light">
                  {pct.toFixed(1)}%
                </span>
              </div>

        
              <div className="h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    background: COLORS[i % COLORS.length],
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
