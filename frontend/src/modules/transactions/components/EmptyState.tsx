import { motion } from "framer-motion";
import { FileSearch } from "lucide-react";

export function EmptyState({
  title = "Nada encontrado",
  subtitle = "",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="
        flex flex-col items-center justify-center
        py-16 px-6 rounded-3xl
        bg-[#F5F2FF] dark:bg-white/5
        border border-[#E6E1F7] dark:border-white/10
        shadow-sm dark:shadow-black/40
        text-center select-none
      "
    >
      
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <FileSearch
          size={44}
          className="text-[#7B61FF] dark:text-[#B6A8FF] mb-4"
        />
      </motion.div>


      <h3 className="text-lg font-semibold text-[#2F2F36] dark:text-white">
        {title}
      </h3>

   
      {subtitle && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-xs">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
