import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import type { CategoryData } from "../types/dashboard";

const COLORS = ["#7B61FF", "#E76BA3", "#2F4A8A", "#A680FF", "#FFB672"];

export function CategoriesPieChart({
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

  return (
    <motion.div
      className="w-full h-[350px]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>

          {/* TOOLTIP ESTÁVEL */}
          <Tooltip
            contentStyle={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              border: "1px solid #E6E1F7",
              color: "#2F2F36",
              padding: "10px 14px",
            }}
            wrapperClassName="dark:!bg-dark-card/80 dark:!border-dark-border"
            labelStyle={{ color: "#7B61FF", fontWeight: 600 }}
            isAnimationActive={false} // <- evita tremedeira 100%
          />

          <Pie
            data={safe}
            dataKey="total"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={45}
            paddingAngle={3}
            startAngle={90}
            endAngle={450}
            // DESATIVA APENAS A ANIMAÇÃO DO PIE PARA O TOOLTIP NÃO TREMER
            isAnimationActive={false}
            label={({ name, value }) =>
              `${name}: R$ ${Number(value).toFixed(2)}`
            }
          >
            {safe.map((_, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]}
                style={{
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as unknown as SVGElement;
                  el.style.filter = "brightness(1.15)";
                  el.style.transform = "scale(1.06)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as unknown as SVGElement;
                  el.style.filter = "brightness(1)";
                  el.style.transform = "scale(1)";
                }}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
