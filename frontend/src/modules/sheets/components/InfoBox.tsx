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
      whileHover={{ scale: 1.018 }}
      transition={{ duration: 0.22 }}
      className="
        relative rounded-3xl p-6 shadow-sm transition-all

        bg-[#F5F4FA] dark:bg-[#1E1D25]
        border border-[#E1E0EB] dark:border-white/15
      "
    >

      <div
        className="absolute top-4 right-4 cursor-pointer"
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
      >
        <HelpCircle
          size={18}
          className="text-gray-600 dark:text-gray-300"
        />

        {showTip && tooltip && (
          <div
            className="
              absolute top-6 right-0 z-40 px-3 py-1 rounded-lg shadow-lg
              text-[11px] whitespace-nowrap

              bg-white dark:bg-[#2A2733]
              text-[#2F2F36] dark:text-white/90
              border border-gray-200 dark:border-white/15
              animate-fadeIn
            "
          >
            {tooltip}
          </div>
        )}
      </div>


      <div className="flex justify-between items-center">
        <h3
          className="
            text-sm font-semibold tracking-wide
            text-[#2F2F36] dark:text-gray-200
          "
        >
          {title}
        </h3>

        <button
          className="
            p-1.5 rounded-xl transition-all
            hover:bg-black/5 dark:hover:bg-white/10
          "
          onClick={() => setHidden(!hidden)}
        >
          {hidden ? (
            <EyeOff size={20} className="text-gray-700 dark:text-gray-300" />
          ) : (
            <Eye size={20} className="text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>


      <div className="mt-4 min-h-[38px]">
        {animated ? (
          <AnimatePresence mode="popLayout">
            <motion.p
              key={value}
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

    
      <div
        className="h-[4px] rounded-full mt-6 opacity-80 dark:opacity-60"
        style={{ background: color }}
      />
    </motion.div>
  );
}
