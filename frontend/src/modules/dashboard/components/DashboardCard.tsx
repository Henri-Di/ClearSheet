import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: number;

  hideable?: boolean; 
}

export function DashboardCard({ icon, iconBg, title, value, hideable = true }: Props) {
  const [hidden, setHidden] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.025,
        y: -4,
        boxShadow: "0 10px 28px rgba(0,0,0,0.14)",
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        relative rounded-3xl p-6 cursor-default select-none
        bg-white/95 dark:bg-dark-card/80
        border border-[#E6E1F7] dark:border-dark-border
        shadow-sm backdrop-blur-xl
        transition-all
      "
    >
      {/* Ícone principal */}
      <motion.div
        className={`
          absolute -top-4 left-4 p-3 rounded-2xl
          shadow-sm backdrop-blur-xl
          border border-white/50 dark:border-white/10
          flex items-center justify-center
          ${iconBg}
        `}
        whileHover={{ scale: 1.12 }}
        transition={{ duration: 0.22 }}
      >
        {icon}
      </motion.div>


      {hideable && (
        <button
          onClick={() => setHidden(!hidden)}
          className="
            absolute top-5 right-5 p-2 
            rounded-xl bg-white/70 dark:bg-white/10 
            border border-black/5 dark:border-white/10 
            backdrop-blur-xl
            hover:bg-white dark:hover:bg-white/20
            transition-all
          "
        >
          {hidden ? (
            <EyeOff size={18} className="text-gray-700 dark:text-gray-300" />
          ) : (
            <Eye size={18} className="text-gray-700 dark:text-gray-300" />
          )}
        </button>
      )}

      <div className="mt-7">
        <p className="text-sm font-medium tracking-wide text-[#5A556A] dark:text-gray-300">
          {title}
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="relative mt-1 h-[44px] flex items-center"
        >
          <h3
            className="
              text-4xl font-display font-semibold tracking-tight
              text-[#2F2F36] dark:text-white
              transition-all
            "
            style={{
              filter: hidden ? "blur(8px)" : "none",
              opacity: hidden ? 0.55 : 1,
            }}
          >
            {value.toLocaleString("pt-BR")}
          </h3>
        </motion.div>
      </div>

  
      <div
        className="
          mt-5 h-[5px] w-full rounded-full 
          bg-gradient-to-r from-primary/40 to-primary/20 
          dark:from-primary/30 dark:to-primary/10
        "
      />
    </motion.div>
  );
}
