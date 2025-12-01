import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "../utils/format";
import { useState } from "react";
import { Eye, EyeOff, HelpCircle } from "lucide-react";

type InfoBoxProps = {
  title: string;
  value: number;
  color: string;
  animated?: boolean;
  tooltip?: string;
};

export function InfoBox({
  title,
  value,
  color,
  animated = false,
  tooltip,
}: InfoBoxProps) {
  const [hidden, setHidden] = useState(false);
  const [showTip, setShowTip] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.22 }}
      className="
        relative rounded-3xl p-6 shadow-sm transition-all
        
        bg-[#F9F8FF] dark:bg-[#1E1D25]
        border border-[#E6E1F7] dark:border-white/10
        backdrop-blur-xl
      "
    >

      {/* Tooltip do título */}
      <div
        className="absolute top-4 right-4 cursor-pointer z-30"
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
      >
        <HelpCircle
          size={18}
          className="text-gray-600 dark:text-gray-300"
        />

        {showTip && tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="
              absolute top-6 right-0 z-40 px-3 py-1.5 rounded-lg shadow-lg
              text-[11px] whitespace-nowrap

              bg-white/95 dark:bg-[#2A2733]
              text-[#2F2F36] dark:text-white/90
              border border-gray-200 dark:border-white/10
              backdrop-blur-xl
            "
          >
            {tooltip}
          </motion.div>
        )}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h3
          className="
            text-sm font-semibold tracking-wide
            text-[#2F2F36] dark:text-gray-200
          "
        >
          {title}
        </h3>

        {/* Botão de esconder */}
        <button
          className="
            p-1.5 rounded-xl transition-all z-20
            hover:bg-black/5 dark:hover:bg-white/10
          "
          onClick={() => setHidden(!hidden)}
        >
          {hidden ? (
            <EyeOff size={18} className="text-gray-700 dark:text-gray-300" />
          ) : (
            <Eye size={18} className="text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Valor */}
      <div
        className={`
          mt-4 min-h-[38px]
          ${hidden ? "opacity-70 blur-[6px]" : "opacity-100 blur-0"}
          transition-all duration-200
        `}
      >
        {animated ? (
          <AnimatePresence mode="popLayout">
            <motion.p
              key={hidden ? "hidden" : value}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.22 }}
              className="
                text-3xl font-extrabold
                text-[#000] dark:text-gray-100
              "
            >
              {hidden ? "•••••" : formatCurrency(value)}
            </motion.p>
          </AnimatePresence>
        ) : (
          <p
            className="
              text-3xl font-extrabold
              text-[#000] dark:text-gray-100
            "
          >
            {hidden ? "•••••" : formatCurrency(value)}
          </p>
        )}
      </div>

      {/* Barra final */}
      <div
        className="h-[5px] rounded-full mt-6 opacity-90 dark:opacity-70"
        style={{ background: color }}
      />
    </motion.div>
  );
}
